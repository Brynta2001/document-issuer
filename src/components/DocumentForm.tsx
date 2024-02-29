import { wrapDocument } from "@govtechsg/open-attestation";
import { useAccountContext } from "../contexts/AccountContext";
import { useDocumentStoreContext } from "../contexts/DocumentStoreContext";
import { useDnsContext } from "../contexts/DnsContext";
import { useStatusContext } from "../contexts/StatusContext";
import { useStepContext } from "../contexts/StepContext";
import { useWrappedDocumentContext } from "../contexts/WrappedDocumentContext";
import { issueDocument } from "../services/document-store";
import { StudentService } from "../services/students/students.service";

export const DocumentForm = () => {
  const { documentStoreAddress } = useDocumentStoreContext();
  const { dns } = useDnsContext();
  const { status, setStatus } = useStatusContext();
  const { setCurrentStep } = useStepContext();
  const { setWrappedDocument } = useWrappedDocumentContext();
  const { signer } = useAccountContext();

  const documentBase = {
    $template: {
      name: "COVERING_LETTER",
      type: "EMBEDDED_RENDERER",
      url: "https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "EPN - Escuela Politécnica Nacional",
        documentStore: documentStoreAddress,
        identityProof: {
          type: "DNS-TXT",
          location: dns,
        },
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDocumentSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);

    const dni: string = data.get("dni")?.toString()!;
    const studentService = new StudentService();
    const student = studentService.getStudentById(dni);

    const documentData = {
      dni: student.dni,
      name: student.name,
      issueDate: new Date().toISOString(),
      period: student.period,
      faculty: student.faculty,
    };

    const rawDocument = {
      ...documentBase,
      recipient: {...documentData},
    };

    try {
      setStatus("pending");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrappedDocument = wrapDocument(rawDocument as any);

      await issueDocument({
        wrappedDocument,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        signer: signer!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        documentStoreAddress: documentStoreAddress!,
      });

      setWrappedDocument(wrappedDocument);
      setCurrentStep("download");

      setStatus("initial");
    } catch (e) {
      setStatus("error");
      console.error(e);
    }
  };

  return (
    <form onSubmit={onDocumentSubmit}>
  <section style={{ marginBottom: "24px" }}>
    <p style={{ color: "black" }}>DNI</p>
    <input
      style={{ padding: "8px 12px", width: "100%" }}
      type="text"
      name="dni"
      defaultValue="9999999999"
    />
  </section>
  <button
    type="submit"
    disabled={status === "pending"}
    style={{
      backgroundColor: "white",
      border: "1px solid black",
      color: "#007bff", // Color de texto azul
      padding: "8px 16px",
      cursor: "pointer",
    }}
  >
    {status === "pending" ? "Pending..." : "Submit"}
  </button>
</form>
  );
};
