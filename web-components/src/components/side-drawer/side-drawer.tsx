import {Component, Method, Prop, State} from '@stencil/core';

@Component({
  tag: 'kv-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @State() showCantactInfo = false;
  @Prop({reflectToAttr: true}) title: string;
  @Prop({reflectToAttr: true, mutable: true}) opened: boolean;

  closeDrawerHandler(): void {
    console.log('close...');
    this.opened = false;
  }

  openDrawerHandler(): void {
    this.opened = true;
  }

  changeContentHandler(content: string): void {
    this.showCantactInfo = content === 'contact';
  }

  @Method()
  open(): void {
    this.opened = true;
  }

  render() {
    let mainContent = <slot></slot>;
    if (this.showCantactInfo) {
      mainContent = (
        <div class='contact-information'>
          <h2>Contact Information</h2><p>You can reach us via phone or email.</p>
          <ul>
            <li>Phone: 561531843210684</li>
            <li>E-mail: <a href='mailto:dkofgvol@jncgfubinwet.com'>dkofgvol@jncgfubinwet.com</a></li>
          </ul>
        </div>
      );
    }

    return [
      <div onClick={this.closeDrawerHandler.bind(this)} class="overlay"></div>,
      <aside>
        <button onClick={this.openDrawerHandler.bind(this)} class='btn-open'>Open</button>
        <header>
          <h1>{this.title}</h1>
          <button onClick={this.closeDrawerHandler.bind(this)} class='btn-close'>X</button>
        </header>
        <section class='tabs'>
          <button
            class={this.showCantactInfo ? '' : 'active'}
            onClick={this.changeContentHandler.bind(this, 'nav')}>
            Navigation
          </button>
          <button
            class={this.showCantactInfo ? 'active' : ''}
            onClick={this.changeContentHandler.bind(this, 'contact')}>
            Contact
          </button>
        </section>
        <main>
          { mainContent }
        </main>
      </aside>
    ];
  }
}
