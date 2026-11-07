import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the title without the products label', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Compare preços');
    expect(compiled.querySelector('.section-label')).toBeNull();
  });

  it('shows the clear button only after a value is entered', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.clear-button')).toBeNull();

    const input = compiled.querySelector<HTMLInputElement>('input[aria-label="Preço em reais do produto 1"]');
    input!.value = '1000';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(compiled.querySelector('.clear-button')).not.toBeNull();

    compiled.querySelector<HTMLButtonElement>('.clear-button')!.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.clear-button')).toBeNull();
  });
});
