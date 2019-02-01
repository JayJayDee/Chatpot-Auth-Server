import { Modules } from '../modules';
import { EndpointRouter, Endpoint, EndpointMethod } from './types';
import { Router } from 'express';
import { injectable } from 'smart-factory';
import { Logger } from '../loggers/types';
import { MemberService } from '../services/types';
import { asyncEndpointWrap } from './wraps';
import { InvalidParamError } from './errors';
import { AuthUtil } from '../utils/types';
import { Auth } from '../stores/types';

injectable(Modules.Endpoint.Auth.Router,
  [Modules.Endpoint.Auth.Auth,
    Modules.Endpoint.Auth.Reauth],
  async (auth, reauth): Promise<EndpointRouter> => {
    const router = Router();
    const endpoints = [ auth, reauth ];
    endpoints.map((endpt: Endpoint) => {
      router[endpt.method].apply(router, [endpt.uri, endpt.handler]);
    });
    return { router, uri: '/auth' };
  });

const authEndpoint =
  (log: Logger,
    auth: MemberService.Authenticate): Endpoint => ({
      uri: '/',
      method: EndpointMethod.POST,
      handler: [
        asyncEndpointWrap(async (req, res, next) => {
          const login_id = req.body['login_id'];
          const password = req.body['password'];
          if (!login_id || !password) throw new InvalidParamError('login_id, password');

          const resp = await auth({ login_id, password });
          res.status(200).json(resp);
        })
      ]
    });
injectable(Modules.Endpoint.Auth.Auth,
  [Modules.Logger,
    Modules.Service.Member.Authenticate],
  async (log, auth) => authEndpoint(log, auth));


injectable(Modules.Endpoint.Auth.Reauth,
  [Modules.Logger,
    Modules.Util.Auth.Decrypt,
    Modules.Util.Auth.RevalidateSession,
    Modules.Store.Auth.GetPassword],
  async (log: Logger,
    decrypt: AuthUtil.DecryptToken,
    revalidate: AuthUtil.RevalidateSessionKey,
    getPassword: Auth.GetPassword): Promise<Endpoint> => ({
    uri: '/reauth',
    method: EndpointMethod.POST,
    handler: [
      asyncEndpointWrap(async (req, res, next) => {
        const token = req.body['token'];
        const oldSessionKey = req.query['session_key'];
        const refreshKey = req.query['refresh_key'];

        if (!token || !oldSessionKey || !refreshKey) {
          throw new InvalidParamError('token, session_key, refresh_key');
        }
        const member = decrypt(token);
        if (!member) throw new InvalidParamError('invalid token');

        const storedPassword = await getPassword(member.member_no);
        const newSessionKey = revalidate(token, oldSessionKey, refreshKey, storedPassword);

        res.status(200).json({
          session_key: newSessionKey
        });
      })
    ]
  }));