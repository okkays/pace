import {MatAutocompleteHarness} from '@angular/material/autocomplete/testing';
import {MatOptionHarness} from '@angular/material/core/testing';
import {firstValueFrom, lastValueFrom} from 'rxjs';
import {shareReplay, take} from 'rxjs/operators';

import {createTestEnvironment, setupModule} from '../component-testing-util';

import {PaceEntryComponent} from './pace-entry.component';



async function getPaceState(componentInputs?: Record<string, unknown>) {
  const {fixture, loader} =
      createTestEnvironment(PaceEntryComponent, componentInputs);
  expect(fixture.componentInstance).toBeTruthy();
  const paceSelected$ =
      fixture.componentInstance.metricsSelected.pipe(shareReplay());
  paceSelected$.subscribe();
  const harness = await loader.getHarness(MatAutocompleteHarness);

  return {paceSelected$, harness};
}

async function getOptionTexts(options: MatOptionHarness[]): Promise<string[]> {
  return await Promise.all(options.map(o => o.getText()));
}

describe('PaceSelectorComponent', () => {
  beforeEach(async () => {
    await setupModule({
      declarations: [PaceEntryComponent],
    });
  });

  it('should show matched durations', async () => {
    const {harness} = await getPaceState();

    await harness.enterText('5 seconds');

    expect(await getOptionTexts(await harness.getOptions()))
        .toContain('5 seconds');
  });

  it('should show matched distances', async () => {
    const {harness} = await getPaceState();

    await harness.enterText('5 feet');

    expect(await getOptionTexts(await harness.getOptions()))
        .toContain('5 feet');
  });

  it('should show matched paces', async () => {
    const {harness} = await getPaceState();

    await harness.enterText('5 km/s');

    expect(await getOptionTexts(await harness.getOptions())).toEqual([
      '5 km/second',
      '5 km/sec',
      '5 km/s',
    ]);
  });

  it('should show matched special paces', async () => {
    const {harness} = await getPaceState();

    await harness.enterText('5 kp');

    expect(await getOptionTexts(await harness.getOptions())).toEqual([
      '5 kpw',
      '5 kpd',
      '5 kph',
      '5 kpm',
      '5 kps',
    ]);
  });

  it('should filter unmatched options', async () => {
    const {harness} = await getPaceState();

    await harness.enterText('Z');

    expect(await getOptionTexts(await harness.getOptions())).toEqual([]);
  });

  it('should emit selected distances', async () => {
    const {harness, paceSelected$} = await getPaceState();

    await harness.enterText('5 ft');
    await harness.selectOption({text: '5 ft'});
    const metrics = await firstValueFrom(paceSelected$);

    expect(metrics).toHaveSize(1);
    expect(metrics[0].unit).toBe('foot');
    expect(metrics[0].value).toBe(5);
  });

  it('should emit selected durations', async () => {
    const {harness, paceSelected$} = await getPaceState();

    await harness.enterText('5 hours');
    await harness.selectOption({text: '5 hours'});
    const metrics = await firstValueFrom(paceSelected$);

    expect(metrics).toHaveSize(1);
    expect(metrics[0].unit).toBe('hour');
    expect(metrics[0].value).toBe(5);
  });

  it('should emit selected paces', async () => {
    const {harness, paceSelected$} = await getPaceState();

    await harness.enterText('5 km/hour');
    await harness.selectOption({text: '5 km/hour'});
    const metrics = await lastValueFrom(paceSelected$.pipe(take(2)));

    expect(metrics).toHaveSize(1);
    expect(metrics[0].unit).toBe('kilometer/hour');
    expect(metrics[0].value).toBe(5);
  });

  it('can be restricted to units only', async () => {
    const {harness} = await getPaceState({allowValues: false});

    await harness.enterText('5 meters');

    const newValue = await harness.getValue();
    expect(newValue).toBe(' meters');
  });
});
