import { Component, computed, signal } from '@angular/core';

interface ComparisonItem {
  readonly id: number;
  readonly priceDigits: string;
  readonly quantity: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly items = signal<ComparisonItem[]>([
    { id: 1, priceDigits: '', quantity: '' },
    { id: 2, priceDigits: '', quantity: '' },
    { id: 3, priceDigits: '', quantity: '' },
  ]);

  protected readonly completeItems = computed(() =>
    this.items()
      .filter((item) => item.priceDigits.length > 0 && item.quantity.length > 0 && Number(item.quantity) > 0)
      .map((item) => ({ ...item, unitPrice: Number(item.priceDigits) / 100 / Number(item.quantity) })),
  );

  protected readonly bestUnitPrice = computed(() => {
    const comparable = this.completeItems();
    return comparable.length >= 2 ? Math.min(...comparable.map((item) => item.unitPrice)) : null;
  });

  protected onPriceInput(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 12);
    this.updateItem(id, { priceDigits: digits });
    input.value = this.formatPrice(digits);
  }

  protected onQuantityInput(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = input.value.replace(/\D/g, '').slice(0, 7);
    this.updateItem(id, { quantity });
    input.value = quantity;
  }

  protected priceValue(item: ComparisonItem): string {
    return this.formatPrice(item.priceDigits);
  }

  protected unitPrice(item: ComparisonItem): number | null {
    if (!item.priceDigits || !item.quantity || Number(item.quantity) <= 0) return null;
    return Number(item.priceDigits) / 100 / Number(item.quantity);
  }

  protected isBest(item: ComparisonItem): boolean {
    const unitPrice = this.unitPrice(item);
    return this.bestUnitPrice() !== null && unitPrice !== null && Math.abs(unitPrice - this.bestUnitPrice()!) < 0.0000001;
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  private formatPrice(digits: string): string {
    if (!digits) return '';
    const cents = Number(digits);
    return (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private updateItem(id: number, changes: Partial<ComparisonItem>): void {
    this.items.update((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item));
  }
}
