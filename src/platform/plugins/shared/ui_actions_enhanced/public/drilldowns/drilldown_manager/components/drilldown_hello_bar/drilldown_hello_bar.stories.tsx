/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import * as React from 'react';
import { DrilldownHelloBar } from '.';

const Demo = () => {
  const [show, setShow] = React.useState(true);
  return show ? (
    <DrilldownHelloBar
      docsLink={'https://elastic.co'}
      onHideClick={() => {
        setShow(false);
      }}
    />
  ) : null;
};

export default {
  title: 'components/DrilldownHelloBar',
};

export const Default = {
  render: () => <Demo />,
  name: 'default',
};
