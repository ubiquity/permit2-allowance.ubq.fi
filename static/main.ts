import { createAppKit } from "@reown/appkit";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { anvil, gnosis, mainnet, polygon, optimism, arbitrum, base, bsc, blast, zksync, avalanche, worldchain, AppKitNetwork } from "@reown/appkit/networks";
import { ethers } from "ethers";
import { renderErrorInModal } from "./display-popup-modal";
import { updateTokenDropdown } from "./populate-dropdown";
import { isApprovalButtonsValid, setupApproveButton, setupRevokeButton, setupButtonValidityListener } from "./handle-approval";
import { providersUrl } from "./constants";
import { useRpcHandler } from "./use-rpc-handler";

// all unhandled errors are caught and displayed in a modal
window.addEventListener("error", (event: ErrorEvent) => renderErrorInModal(event.error));
window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
  renderErrorInModal(event.reason as Error);
  event.preventDefault();
});

const projectId = "415760038f8e330de4868120be3205b8";

const metadata = {
  name: "Ubiquity Allowance",
  description: "Allow funding in Ubiquity",
  url: "https://permit2-allowance.ubq.fi",
  icons: ["https://avatars.githubusercontent.com/u/76412717"],
};

let networks: [AppKitNetwork, ...AppKitNetwork[]];
if (window.location.hostname === "localhost" || window.location.hostname === "0.0.0.0") {
  console.log("enabling anvil");
  networks = [anvil, gnosis, mainnet, polygon, optimism, arbitrum, base, bsc, blast, zksync, avalanche, worldchain];
} else {
  networks = [gnosis, mainnet, polygon, optimism, arbitrum, base, bsc, blast, zksync, avalanche, worldchain];
}

export const appState = createAppKit({
  adapters: [new Ethers5Adapter()],
  networks,
  defaultNetwork: gnosis,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

export let provider: ethers.providers.JsonRpcProvider | undefined;
export let userSigner: ethers.Signer | undefined;
let web3Provider: ethers.providers.Web3Provider | undefined;

async function initializeProviderAndSigner() {
  const networkId = Number(appState.getChainId());
  if (networkId && providersUrl[networkId]) {
    // read-only provider for fetching
    provider = await useRpcHandler(networkId);
  } else {
    console.error("No provider URL found for the current network ID");
    provider = undefined;
  }

  // if user is connected, set up the signer using the injected provider (window.ethereum)
  if (appState.getIsConnectedState() && window.ethereum) {
    const ethereum = window.ethereum as ethers.providers.ExternalProvider;
    if (ethereum.request) {
      await ethereum.request({ method: "eth_requestAccounts" });
    }

    // Create a Web3Provider from window.ethereum
    web3Provider = new ethers.providers.Web3Provider(window.ethereum);

    // web3Provider signer will handle transaction signing
    userSigner = web3Provider.getSigner(appState.getAddress());

    console.log("User address:", await userSigner.getAddress());
  } else {
    userSigner = undefined;
  }

  // update UI elements that depend on connection state
  await isApprovalButtonsValid();
  updateTokenDropdown();
}

function handleNetworkSwitch() {
  // network change listener
  appState.subscribeCaipNetworkChange((newState?: { id: string | number; name: string }) => {
    void (async () => {
      if (newState) {
        await initializeProviderAndSigner();
        console.log(`Network switched to ${newState.name} (${newState.id})`);
      }
    })();
  });

  appState.subscribeWalletInfo(() => {
    void (async () => {
      await initializeProviderAndSigner();
    })();
  });
}

export async function mainModule() {
  try {
    await setupButtonValidityListener();
    updateTokenDropdown();
    setupApproveButton();
    setupRevokeButton();
    handleNetworkSwitch();

    // initialize for the first time
    await initializeProviderAndSigner();
  } catch (error) {
    console.error("Error in main:", error);
    renderErrorInModal(error as Error);
  }
}

mainModule().catch((error) => {
  console.error("Unhandled error:", error);
});
