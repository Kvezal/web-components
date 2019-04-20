import { Component, Prop, State, Watch } from '@stencil/core';

import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'kv-stock-price',
  styleUrl: 'stock-price.css',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement;

  @State() priceFetch: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;

  @Prop({ reflectToAttr: true, mutable: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }
    this.stockUserInput = newValue;
    console.log(newValue);
    this.fetchStockPrice(newValue);
  }

  onUserInput(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockInputValid = this.stockUserInput.trim().length > 0;
  }

  onFetchStockPrice(event): void {
    this.stockSymbol= this.stockUserInput;
    event.preventDefault();
  }

  componentWillLoad(): void {
    console.log('componentWillLoad');
    this.priceFetch = 0;
  }

  componentDidLoad(): void {
    console.log('componentDidLoad')
    if (this.stockSymbol) {
      this.stockUserInput = this.stockSymbol;
      this.stockInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentWillUpdate(): void {
    console.log('componentWillUpdate');
  }

  componentDidUpdate(): void {
    console.log('componentDidUpdate');
  }

  fetchStockPrice(stockSymbol: string): void {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Invalid');
        }
        return res.json()
      })
      .then((parsedRes) => {
        this.error = null;
        this.priceFetch = null;
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid Symbol');
        }
        this.priceFetch = +parsedRes['Global Quote']['05. price'];
      })
      .catch(err => this.error = err.message);
  }

  render() {
    let dataContent = <p>Place enter a symbol</p>;
    if (this.error) {
      dataContent = <p>{this.error}</p>;
    }
    if (this.priceFetch) {
      dataContent = <p class="kv-stock-price__price">Price: ${this.priceFetch}</p>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)} class="kv-stock-price__form">
        <input
          class="kv-stock-price__input"
          type="text"
          ref={el => this.stockInput = el}
          value={this.stockUserInput}
          onInput={this.onUserInput.bind(this)}
        />
        <button
          class="kv-stock-price__button"
          type="submit"
          disabled={!this.stockInputValid}
        >Fetch</button>
      </form>,
      <div>{dataContent}</div>
    ];
  }
}
