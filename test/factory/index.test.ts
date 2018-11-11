import { createInstantiator, InstanceType } from '../../src/factory';
import { NullInstanceError } from '../../src/factory/errors';

describe('Instantiator tests', () => {
  let instanceMap: Map<InstanceType, any> = null;

  beforeEach(() => {
    instanceMap = new Map<InstanceType, any>();
  });

  test('after passed instantiate(), instance must be set in map.', () => {
    const instantiate = createInstantiator(instanceMap);
    instantiate(InstanceType.Mysql, async () => {
      return 1;
    })
    .then(() => {
      expect(instanceMap.get(InstanceType.Mysql)).toBe(1);
    });
  });
  
  test('if trying to instantiate null instance, must be throw error', () => {
    const instantiate = createInstantiator(instanceMap);
    expect(instantiate(InstanceType.Mysql, async () => null))
    .rejects.toBeInstanceOf(NullInstanceError);
  });
});