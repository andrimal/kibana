/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import expect from '@kbn/expect';
import { X_ELASTIC_INTERNAL_ORIGIN_REQUEST } from '@kbn/core-http-common';
import { FtrProviderContext } from '../../ftr_provider_context';

const apiUrl = '/api/kibana/management/saved_objects/scroll/counts';
const defaultTypes = ['visualization', 'index-pattern', 'search', 'dashboard'];

export default function ({ getService }: FtrProviderContext) {
  const supertest = getService('supertest');
  const kibanaServer = getService('kibanaServer');
  const esArchiver = getService('esArchiver');

  describe('scroll_count', () => {
    describe('with less than 10k objects', () => {
      before(async () => {
        await kibanaServer.savedObjects.cleanStandardList();
        await kibanaServer.importExport.load(
          'src/platform/test/api_integration/fixtures/kbn_archiver/saved_objects/scroll_count.json'
        );
      });
      after(async () => {
        await kibanaServer.importExport.unload(
          'src/platform/test/api_integration/fixtures/kbn_archiver/saved_objects/scroll_count.json'
        );
        await kibanaServer.savedObjects.cleanStandardList();
      });

      it('returns the count for each included types', async () => {
        const res = await supertest
          .post(apiUrl)
          .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
          .send({
            typesToInclude: defaultTypes,
          })
          .expect(200);

        expect(res.body).to.eql({
          dashboard: 2,
          'index-pattern': 1,
          search: 1,
          visualization: 2,
        });
      });

      it('only returns count for types to include', async () => {
        const res = await supertest
          .post(apiUrl)
          .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
          .send({
            typesToInclude: ['dashboard', 'search'],
          })
          .expect(200);

        expect(res.body).to.eql({
          dashboard: 2,
          search: 1,
        });
      });

      it('filters on title when `searchString` is provided', async () => {
        const res = await supertest
          .post(apiUrl)
          .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
          .send({
            typesToInclude: defaultTypes,
            searchString: 'Amazing',
          })
          .expect(200);

        expect(res.body).to.eql({
          dashboard: 1,
          visualization: 1,
          'index-pattern': 0,
          search: 0,
        });
      });

      it('includes all requested types even when none match the search', async () => {
        const res = await supertest
          .post(apiUrl)
          .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
          .send({
            typesToInclude: ['dashboard', 'search', 'visualization'],
            searchString: 'nothing-will-match',
          })
          .expect(200);

        expect(res.body).to.eql({
          dashboard: 0,
          visualization: 0,
          search: 0,
        });
      });
    });

    describe('scroll_count with more than 10k objects', () => {
      const importVisualizations = async ({
        startIdx = 1,
        endIdx,
      }: {
        startIdx?: number;
        endIdx: number;
      }) => {
        const fileChunks: string[] = [];
        for (let i = startIdx; i <= endIdx; i++) {
          const id = `test-vis-${i}`;
          fileChunks.push(
            JSON.stringify({
              type: 'visualization',
              id,
              attributes: {
                title: `My visualization (${i})`,
                uiStateJSON: '{}',
                visState: '{}',
              },
              references: [],
            })
          );
        }

        await supertest
          .post(`/api/saved_objects/_import`)
          .attach('file', Buffer.from(fileChunks.join('\n'), 'utf8'), 'export.ndjson')
          .expect(200);
      };

      before(async () => {
        await importVisualizations({ startIdx: 1, endIdx: 6000 });
        await importVisualizations({ startIdx: 6001, endIdx: 12000 });
      });
      after(async () => {
        await esArchiver.emptyKibanaIndex();
      });

      it('returns the correct count for each included types', async () => {
        const res = await supertest
          .post(apiUrl)
          .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
          .send({
            typesToInclude: ['visualization'],
          })
          .expect(200);

        expect(res.body).to.eql({
          visualization: 12000,
        });
      });
    });
  });
}
