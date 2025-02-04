import { appState } from "./main";

const tokensByNetwork: { [key: number]: { [token: string]: string } } = {
  1: {
    UUSD: "0xb6919Ef2ee4aFC163BC954C5678e2BB570c2D103",
  },
  100: {
    UUSD: "0xc6ed4f520f6a4e4dc27273509239b7f8a68d2068",
  },
  31337: {
    UUSD: "0xb6919Ef2ee4aFC163BC954C5678e2BB570c2D103",
  },
};

const tokenSelector = document.querySelector(".token-selector") as HTMLInputElement;
const tokenOptions = document.querySelector("#token-options") as HTMLSelectElement;

export function updateTokenDropdown() {
  const networkId = Number(appState.getChainId());

  const tokens = tokensByNetwork[networkId] || {};

  if (tokenSelector && tokenOptions) {
    tokenOptions.innerHTML = ""; // Clear existing options

    for (const [key, value] of Object.entries(tokens)) {
      const option = document.createElement("option");
      option.text = key;
      option.value = value as string;
      tokenOptions.appendChild(option);
    }
  }
}
