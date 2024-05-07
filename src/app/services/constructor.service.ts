import { Injectable } from '@angular/core';
interface elements {
  [key: string]: {
    configurator: boolean,
    properties: {
      [key: string]: any
    },
    place: string
  }
}
@Injectable({
  providedIn: 'root'
})
export class ConstructorService {
  public elements: elements = {
    section: {
      configurator: false,
      properties: {
        className: "element section prime"
      },
      place: "all"
    },
    area: {
      configurator: false,
      properties: {
        className: "element area prime"
      },
      place: "all"
    },
    img: {
      configurator: true,
      properties: {
        className: "element img prime"
      },
      place: "all"
    },
    list: {
      configurator: true,
      properties: {
        className: "element list prime"
      },
      place: "all"
    },
    title: {
      configurator: true,
      properties: {
        className: "element title prime"
      },
      place: "all"
    },
    paragraph: {
      configurator: false,
      properties: {
        className: "element paragraph prime"
      },
      place: "all"
    },
    btn: {
      configurator: true,
      properties: {
        className: "element btn prime"
      },
      place: "all"
    },
    "social-btn": {
      configurator: true,
      properties: {
        className: "element social-btn prime"
      },
      place: "all"
    },
    "download-btn": {
      configurator: true,
      properties: {
        className: "element download-btn prime"
      },
      place: "all"
    },
    video: {
      configurator: true,
      properties: {
        className: "element video prime"
      },
      place: "all"
    },
    swiper: {
      configurator: true,
      properties: {
        className: "element swipers prime"
      },
      place: "all"
    },
  }
  public styles = [
    {
      optGroupName: "text",
      group: [
        { name: 'Text Color', value: 'color', type: "user-color" },
        { name: 'Font Size', value: 'font-size', type: "user-size" },
        { name: 'Font Weight', value: 'font-weight', type: "user-select", values: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
        { name: 'Text Align', value: 'text-align', type: "user-select", values: ["start", "end", "left", "right", "center"] },
        { name: 'Line Height', value: 'line-height', type: "user-size" },
        { name: 'Letter Spacing', value: 'letter-spacing', type: "user-size" },
        { name: 'Text Transform', value: 'text-transform', type: "user-select", values: ["none", "capitalize", "uppercase", "lowercase", " full-width", "full-size-kana"] },
      ]
    },
    {
      optGroupName: "margin",
      group: [
        { name: 'Margin Top', value: 'margin-top', type: "user-size" },
        { name: 'Margin Right', value: 'margin-right', type: "user-size" },
        { name: 'Margin Bottom', value: 'margin-bottom', type: "user-size" },
        { name: 'Margin Left', value: 'margin-left', type: "user-size" },
      ]
    },
    {
      optGroupName: "padding",
      group: [
        { name: 'Padding Top', value: 'padding-top', type: "user-size" },
        { name: 'Padding Right', value: 'padding-right', type: "user-size" },
        { name: 'Padding Bottom', value: 'padding-bottom', type: "user-size" },
        { name: 'Padding Left', value: 'padding-left', type: "user-size" },
      ]
    },
    {
      optGroupName: "border",
      group: [
        { name: 'Border Width', value: 'border-width', type: "user-size" },
        { name: 'Border Color', value: 'border-color', type: "user-color" },
        { name: 'Border Style', value: 'border-style', type: "user-select", values: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"] },
        { name: 'Border Radius', value: 'border-radius', type: "user-size" },
      ]
    },
    {
      optGroupName: "background",
      group: [
        { name: 'Background Color', value: 'background-color', type: "user-color" },
        { name: 'Background Position', value: 'background-position', type: "user-select", values: ["top", "bottom", "left", "right", "center"] },
        { name: 'Background Size', value: 'background-size', type: "user-select", values: ["cover", "contain"] },
        { name: 'Background Repeat', value: 'background-repeat', type: "user-select", values: ["repeat-x", "repeat-y", "repeat", "space", "round", "no-repeat"] },
      ]
    },
    {
      optGroupName: "size and position",
      group: [
        { name: 'Width', value: 'width', type: "user-size" },
        { name: 'Height', value: 'height', type: "user-size" },
        { name: 'Position', value: 'position', type: "user-select", values: ["static", "relative", "absolute", "fixed", "sticky"] },
        { name: 'left', value: 'left', type: "user-size" },
        { name: 'top', value: 'top', type: "user-size" },
        { name: 'right', value: 'right', type: "user-size" },
        { name: 'bottom', value: 'bottom', type: "user-size" },
        { name: 'Float', value: 'float', type: "user-select", values: ["left", "right", "none"] },
        { name: 'Clear', value: 'clear', type: "user-select", values: ["none", "left", "right", "both"] },
      ]
    },
    {
      optGroupName: "Display",
      group: [
        { name: 'Display', value: 'display', type: "user-select", values: ["none", "block", "inline", "inline-block", "flex", "inline-flex"] },
        { name: 'flex direction', value: 'flex-direction', type: "user-select", values: ["none", "row", "row-reverse", "column", "column-reverse"] },
        { name: 'flex grow', value: 'flex-grow', type: "user-numb" },
        { name: 'justify content', value: 'justify-content', type: "user-select", values: ["normal", "center", "start", "end", "left", "right", "space-between", "space-around","space-evenly", "stretch"] },
        { name: 'align items', value: 'align-items', type: "user-select", values: ["normal", "stretch", "center", "start", "end", "baseline"] },
      ]
    },
    {
      optGroupName: "other",
      group: [
        { name: 'Overflow', value: 'overflow', type: "user-select", values: ["visible", "hidden", "clip", "scroll", "auto"] },
        { name: 'Z-Index', value: 'z-index', type: "user-numb" },
        { name: 'Box Shadow', value: 'box-shadow', type: "user-text" },
        { name: 'Opacity', value: 'opacity', type: "user-numb" },
        { name: 'User Select', value: 'user-select', type: "user-select", values: ["none", "auto", "text", "contain", "all"] }
      ]
    }
  ];
}
