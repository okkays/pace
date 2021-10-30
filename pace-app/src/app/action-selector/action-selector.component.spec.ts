import {MatAutocompleteHarness} from '@angular/material/autocomplete/testing';
import {MatOptionHarness, OptionHarnessFilters} from '@angular/material/core/testing';
import {firstValueFrom} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

import {createTestEnvironment, setupModule} from '../component-testing-util';

import {ActionSelectorComponent} from './action-selector.component';

async function getActionState() {
  const {fixture, loader} = createTestEnvironment(ActionSelectorComponent);
  expect(fixture.componentInstance).toBeTruthy();
  const actionSelected$ =
      fixture.componentInstance.actionSelected.pipe(shareReplay());
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
      declarations: [ActionSelectorComponent],
    });
  });

  it('should show matched options', async () => {
    const {harness} = await getActionState();

    await harness.enterText('Conv');

    expect(await getOptionTexts(await harness.getOptions())).toEqual([
      'Convert'
    ]);
  });

  it('should filter unmatched options', async () => {
    const {harness} = await getActionState();

    await harness.enterText('D');

    expect(await getOptionTexts(await harness.getOptions())).toEqual([]);
  });

  it('should emit selected options', async () => {
    const {harness, actionSelected$} = await getActionState();

    await harness.selectOption({text: 'Convert'});

    expect(await firstValueFrom(actionSelected$)).toBe('Convert');
  });
});
