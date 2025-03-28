/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { HttpServiceSetup } from '@kbn/core/server';
import { UsageCounter } from '@kbn/usage-collection-plugin/server';

export function registerRoutes(http: HttpServiceSetup, usageCounter: UsageCounter) {
  const router = http.createRouter();
  router.get(
    {
      path: '/api/usage_collection_test_plugin',
      security: {
        authz: {
          enabled: false,
          reason: 'This route is opted out from authorization',
        },
      },
      validate: false,
    },
    async (context, req, res) => {
      usageCounter.incrementCounter({ counterName: 'routeAccessed' });
      return res.ok();
    }
  );
}
