import { injectable } from 'smart-factory';
import { EndpointModules } from './modules';
import { EndpointTypes } from './types';

injectable(EndpointModules.Abuse.ReportUser,
  [ EndpointModules.Utils.WrapAync ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/abuse/report',
    method: EndpointTypes.EndpointMethod.POST,
    handler: [
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));


injectable(EndpointModules.Abuse.GetReports,
  [ EndpointModules.Utils.WrapAync ],
  async (wrapAsync: EndpointTypes.Utils.WrapAsync): Promise<EndpointTypes.Endpoint> =>

  ({
    uri: '/abuse/:member_token/reports',
    method: EndpointTypes.EndpointMethod.GET,
    handler: [
      wrapAsync(async (req, res, next) => {
        res.status(200).json({});
      })
    ]
  }));