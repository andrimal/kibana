/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { PluginInitializerContext } from '@kbn/core/public';

export type {
  FeatureCatalogueSetup,
  EnvironmentSetup,
  TutorialSetup,
  HomePublicPluginSetup,
  HomePublicPluginStart,
} from './plugin';

export type {
  AddDataTab,
  FeatureCatalogueCategory,
  FeatureCatalogueEntry,
  FeatureCatalogueRegistry,
  FeatureCatalogueSolution,
  Environment,
  TutorialVariables,
  TutorialDirectoryHeaderLinkComponent,
  TutorialModuleNoticeComponent,
  WelcomeRenderTelemetryNotice,
  WelcomeServiceSetup,
} from './services';
export type { CustomComponentProps } from './services/tutorials/tutorial_service';

export { INSTRUCTION_VARIANT, getDisplayText } from '../common/instruction_variant';

import { HomePublicPlugin } from './plugin';

export const plugin = (initializerContext: PluginInitializerContext) =>
  new HomePublicPlugin(initializerContext);
