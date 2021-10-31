import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {Type} from '@angular/core';
import {ComponentFixture, TestBed, TestModuleMetadata} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from './material/material.module';

const DEFAULTS: TestModuleMetadata =
    {
      imports: [NoopAnimationsModule, MaterialModule],
      providers: [],
      declarations: [],
    }

export async function setupModule(additionalModuleDef: TestModuleMetadata) {
  const mergedDefs: TestModuleMetadata = {
    ...additionalModuleDef,
    imports:
        (additionalModuleDef.imports || []).concat(...DEFAULTS.imports || []),
    providers: (additionalModuleDef.providers ||
                []).concat(...DEFAULTS.providers || []),
    declarations: (additionalModuleDef.declarations ||
                   []).concat(...DEFAULTS.declarations || []),
  };

  await TestBed.configureTestingModule(mergedDefs).compileComponents();
}

export function createTestEnvironment<T>(
    componentType: Type<T>, componentInputs?: Partial<T>) {
  const fixture: ComponentFixture<T> = TestBed.createComponent(componentType);
  const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);

  if (componentInputs) {
    Object.assign(fixture.componentInstance, componentInputs);
  }

  fixture.detectChanges();
  return {fixture, loader};
}
