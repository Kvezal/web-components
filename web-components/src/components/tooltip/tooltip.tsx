import {Component, Prop} from "@stencil/core";

@Component({
  tag: 'kv-tooltip',
  styleUrl: 'tooltip.css',
  shadow: true,
})
export class Tooltip {
  @Prop({reflectToAttr: true}) text = 'Some dummy tooltip text.';
  @Prop({reflectToAttr: true, mutable: true}) opened = false;

  render() {
    const content = [
      <slot>Some default</slot> ,
      <span onClick={this.toggleTooltip.bind(this)} class="tooltip__icon">?</span>
    ];
    if (this.opened) {
      content.push(<div class="tooltip__container">{ this.text }</div>);
    }

    return content;
  }

  toggleTooltip(): void {
    this.opened = !this.opened;
  }
}
