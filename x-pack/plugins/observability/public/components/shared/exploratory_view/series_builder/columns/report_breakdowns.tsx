/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { Breakdowns } from '../../series_editor/columns/breakdowns';
import { SeriesConfig } from '../../types';

export function ReportBreakdowns({
  seriesId,
  seriesConfig,
}: {
  seriesConfig: SeriesConfig;
  seriesId: string;
}) {
  return (
    <Breakdowns
      seriesConfig={seriesConfig}
      breakdowns={seriesConfig.breakdownFields ?? []}
      seriesId={seriesId}
    />
  );
}
