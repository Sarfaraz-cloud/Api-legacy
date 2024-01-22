import { LightningElement, track } from "lwc";

export default class LegacyHomePage extends LightningElement {
  @track setupComponent = true;
  steps = [
    { label: "homepage", value: "homepage" },
    { label: "autharizationType", value: "autharizationType" },
    { label: "apiRequest", value: "apiRequest" },
    { label: "fieldMapping", value: "fieldMapping" },
    { label: "cronMaker", value: "cronMaker" },
    { label: "finish", value: "finish" }
  ];
}