import { saveAs } from "file-saver";
import { useAccountContext } from "../contexts/AccountContext";
import { useDocumentStoreContext } from "../contexts/DocumentStoreContext";
import { useStatusContext } from "../contexts/StatusContext";
import { useStepContext } from "../contexts/StepContext";
import { useWrappedDocumentContext } from "../contexts/WrappedDocumentContext";
import { step } from "../types";
import { getAccount } from "../services/account";
import { deployDocumentStore } from "../services/document-store";
import { Button } from "../components/Button";
import { Dns } from "../components/Dns";
import { DocumentForm } from "../components/DocumentForm";

const Step = ({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: React.ReactElement;
}) => {
  return (
    <>
  <h2 style={{ color: '#0050A6' }}>
    {index + 1}. {title}
  </h2>
  {body}
</>
  );
};

export const Steps = () => {
  const { signer, setSigner, setNetwork } = useAccountContext();
  const { setDocumentStoreAddress } = useDocumentStoreContext();
  const { setStatus } = useStatusContext();
  const { currentStep, setCurrentStep } = useStepContext();
  const { wrappedDocument } = useWrappedDocumentContext();

  const onConnect = async () => {
    try {
      const { providerSigner, providerNetwork } = await getAccount();
      setSigner(providerSigner);
      setNetwork(providerNetwork);
      setCurrentStep("deploy");
    } catch (e) {
      console.error(e);
    }
  };

  const onDeploy = async () => {
    try {
      setStatus("pending");

      const documentStoreAddress = await deployDocumentStore(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        signer!,
      );
      console.log(documentStoreAddress);
      setDocumentStoreAddress(documentStoreAddress);

      setCurrentStep("dns");
      setStatus("initial");
    } catch (e) {
      setStatus("error");
      console.error(e);
    }
  };

  const onDownload = () => {
    const blob = new Blob([JSON.stringify(wrappedDocument, null, 2)], {
      type: "text/json;charset=utf-8",
    });
    saveAs(blob, `SIMPLE_COO_DOCUMENT.tt`);
  };

  const onCreateAnother = () => {
    setCurrentStep("document");
  };

  const steps: {
    key: step;
    title: string;
    body: React.ReactElement;
  }[] = [
    {
      key: "connect",
      title: "Connect Metamask Extension",
      body: <Button buttonText="Connect" onHandler={onConnect}/>,
    },
    {
      key: "deploy",
      title: "Deploy Document Store",
      body: <Button buttonText="Deploy" onHandler={onDeploy} />,
    },
    {
      key: "dns",
      title: "Domain Name Configuration",
      body: <Dns />,
    },
    {
      key: "document",
      title: "Edit Document Form",
      body: <DocumentForm />,
    },
    {
      key: "download",
      title: "Download & Verify",
      body: (
        <>
          <Button buttonText="Download" onHandler={onDownload} />
          <a
            href="https://dev.tradetrust.io/verify"
            target="_blank"
            rel="noreferrer noopener"
            style={{ margin: "0 8px 8px 0" }}
          >
            <button style={{margin: "0 8px 8px 0",
    backgroundColor: "white",
    border: "1px solid black",
    color: "#0050A6", // Color de texto azul
    padding: "8px 16px",
    cursor: "pointer",}}>Verify</button>
          </a>
          <Button buttonText="Create Another" onHandler={onCreateAnother} />
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex" }}>
        {steps.map((step) => (
          <div
            key={`step-${step.key}`}
            style={{
              padding: "0 8px",
              borderLeft: currentStep === step.key ? "solid 4px #007bff" : "none",
            }}
          >
            <div
              style={{
                opacity: currentStep === step.key ? "1" : "0.2",
                lineHeight: 1.3,
                fontSize: "20px",
                color: "#0050A6", // Text color blue
              }}
            >
              {step.title}
            </div>
          </div>
        ))}
      </div>
      {steps.map(
        (step, index) =>
          currentStep === step.key && <Step {...{ index, ...step }} />,
      )}
    </>
  );
};
