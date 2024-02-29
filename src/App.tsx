import { AccountContextProvider } from "./contexts/AccountContext";
import { DnsContextProvider } from "./contexts/DnsContext";
import { DocumemtStoreProvider } from "./contexts/DocumentStoreContext";
import { StatusProvider } from "./contexts/StatusContext";
import { StepProvider } from "./contexts/StepContext";
import { WrappedDocumentProvider } from "./contexts/WrappedDocumentContext";
import { Steps } from "./components/Steps";
import { combineContextProviders } from "./utils";
import "./App.css";

const App = () => {
  const providers = [
    AccountContextProvider,
    DnsContextProvider,
    DocumemtStoreProvider,
    StatusProvider,
    StepProvider,
    WrappedDocumentProvider,
  ];
  const AppContextProvider = combineContextProviders(providers);

  return (
    <AppContextProvider>
  <main>
    <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
      <img src="https://cem.epn.edu.ec/imagenes/logos_institucionales/big_png/EPN_logo_big.png" alt="EPN Logo" style={{ width: '170px', height: '100px', marginRight: '10px' }} />
      <p style={{ color: '#0050A6', fontSize: '50px', marginLeft: '50px', fontWeight: 'bold',  }}>EPN certificate issuance system</p>
    </div>
    <Steps />
  </main>
</AppContextProvider>
  );
  
};

export default App;
