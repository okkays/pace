import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatAutocompleteHarness} from '@angular/material/autocomplete/testing';
import {MatOptionHarness, OptionHarnessFilters} from '@angular/material/core/testing';
import {firstValueFrom} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

import {createTestEnvironment, setupModule} from '../component-testing-util';

import {PaceEntryComponent} from './pace-entry.component';

async function getActionState() {
  const {fixture, loader} = createTestEnvironment(PaceEntryComponent);
  expect(fixture.componentInstance).toBeTruthy();
  const actionSelected$ =
      fixture.componentInstance.metricsSelected.pipe(shareReplay());
  actionSelected$.subscribe();
  const harness = await loader.getHarness(MatAutocompleteHarness);

  return {actionSelected$, harness};
}

async function getOptionTexts(options: MatOptionHarness[]): Promise<string[]> {
  return await Promise.all(options.map(o => o.getText()));
}

describe('ActionSelectorComponent', () => {
  beforeEach(async () => {
    await setupModule({
      declarations: [PaceEntryComponent],
    });
  });

  it('should show matched durations', async () => {
    const {harness} = await getActionState();

    await harness.enterText('5 seconds');

    expect(await getOptionTexts(await harness.getOptions()))
        .toContain('5 seconds');
  });

  it('should show matched distances', async () => {
    const {harness} = await getActionState();

    await harness.enterText('5 feet');

    expect(await getOptionTexts(await harness.getOptions()))
        .toContain('5 feet');
  });

  it('should show matched paces', async () => {
    const {harness} = await getActionState();

    await harness.enterText('5 km/s');

    expect(await getOptionTexts(await harness.getOptions())).toEqual([
      '5 km/second',
      '5 km/sec',
      '5 km/s',
    ]);
  });

  it('should show matched special paces', async () => {
    const {harness} = await getActionState();

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
    const {harness} = await getActionState();

    await harness.enterText('Z');

    expect(await getOptionTexts(await harness.getOptions())).toEqual([]);
  });

  //   it('should emit selected options', async () => {
  //     const {harness, actionSelected$} = await getActionState();

  //     await harness.selectOption({text: 'Convert'});

  //     expect(await firstValueFrom(actionSelected$)).toBe('Convert');
  //   });
});
