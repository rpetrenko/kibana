/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { savedObjectsClientMock } from '../../../../../../../src/core/server/mocks';
import { alertsClientMock } from '../../../../../alerts/server/mocks';
import {
  mockPrepackagedRule,
  getFindResultWithSingleHit,
} from '../routes/__mocks__/request_responses';
import { updatePrepackagedRules } from './update_prepacked_rules';
import { patchRules } from './patch_rules';
jest.mock('./patch_rules');

describe('updatePrepackagedRules', () => {
  let alertsClient: ReturnType<typeof alertsClientMock.create>;
  let savedObjectsClient: ReturnType<typeof savedObjectsClientMock.create>;

  beforeEach(() => {
    alertsClient = alertsClientMock.create();
    savedObjectsClient = savedObjectsClientMock.create();
  });

  it('should omit actions and enabled when calling patchRules', async () => {
    const actions = [
      {
        group: 'group',
        id: 'id',
        action_type_id: 'action_type_id',
        params: {},
      },
    ];
    const outputIndex = 'outputIndex';
    const prepackagedRule = mockPrepackagedRule();
    alertsClient.find.mockResolvedValue(getFindResultWithSingleHit());

    await updatePrepackagedRules(
      alertsClient,
      savedObjectsClient,
      [{ ...prepackagedRule, actions }],
      outputIndex
    );

    expect(patchRules).toHaveBeenCalledWith(
      expect.not.objectContaining({
        enabled: true,
        actions,
      })
    );
  });
});
