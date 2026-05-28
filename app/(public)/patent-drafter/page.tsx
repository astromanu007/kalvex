"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2, Loader2, Download, FileImage, Sparkles,
  UserPlus, Image as ImageIcon, Info, Plus, GripVertical,
  BrainCircuit, Layout, Zap, Printer, CheckCircle2,
  ShieldCheck, Lock, CreditCard, ChevronRight, Check
} from "lucide-react";
import {
  Document, Page, Text, View, Image as PDFImage,
  StyleSheet, PDFDownloadLink
} from "@react-pdf/renderer";
import { motion, Reorder, useDragControls } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LOCARNO_CLASSES } from "@/lib/locarno";
import { analyzePatent } from "@/lib/ai-engine";
import { createPatentDraft, createPatentPaymentOrder, verifyPatentPayment } from "@/app/actions/patent";

// Define views for the patent
const PATENT_VIEWS = [
  { id: "perspective", label: "Perspective View" },
  { id: "front", label: "Front View" },
  { id: "back", label: "Back View" },
  { id: "left", label: "Left Hand Side View" },
  { id: "right", label: "Right Hand Side View" },
  { id: "top", label: "Top View" },
  { id: "bottom", label: "Bottom View" },
];

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: { padding: 30, paddingLeft: 40, paddingRight: 40, fontFamily: "Times-Roman", fontSize: 9, lineHeight: 1.4 },
  docTitle: { textAlign: "center", fontSize: 9, fontWeight: "bold", textDecoration: "underline", marginBottom: 10, textTransform: "uppercase" },
  headerBox: { flexDirection: "row", border: "1pt solid black", marginBottom: 5 },
  headerLeft: { flex: 3, borderRight: "1pt solid black", padding: 6 },
  headerRight: { flex: 1, padding: 6, alignItems: "center", justifyContent: "center" },
  boldText: { fontWeight: "bold" },
  viewContainer: { width: "100%", height: 160, alignItems: "center", justifyContent: "center", marginBottom: 5 },
  viewImage: { width: "auto", height: "100%", objectFit: "contain" },
  viewLabel: { textAlign: "center", fontSize: 10, fontWeight: "bold", textDecoration: "underline", marginBottom: 10, textTransform: "uppercase" },
  noveltyBlock: { textAlign: "justify", marginBottom: 10 },
  paragraph: { marginBottom: 4 },
  dated: { fontWeight: "bold", marginTop: 2, marginBottom: 15 },
  sigSection: { alignSelf: "flex-end", width: "40%", marginTop: "auto", marginBottom: 10 },
  sigRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 10, paddingBottom: 1, marginBottom: 2 },
  sigImage: { height: 28, objectFit: "contain" },
  footer: { fontWeight: "bold", textTransform: "uppercase", fontSize: 8 }
});

// Disclosure PDF Styles
const dStyles = StyleSheet.create({
  page: { padding: 36, fontFamily: "Times-Roman", fontSize: 9, lineHeight: 1.5 },
  title: { textAlign: "center", fontSize: 13, fontWeight: "bold", textDecoration: "underline", marginBottom: 2 },
  formName: { textAlign: "center", fontSize: 10, marginBottom: 2 },
  subtitle: { textAlign: "center", fontSize: 9, marginBottom: 16 },
  table: { border: "1pt solid black" },
  row: { flexDirection: "row", borderBottom: "1pt solid black" },
  lastRow: { flexDirection: "row" },
  labelCell: { width: 55, borderRight: "1pt solid black", paddingVertical: 4, paddingHorizontal: 2, fontSize: 8.5 },
  valueCell: { flex: 1, paddingVertical: 4, paddingHorizontal: 4, fontSize: 8.5 },
  bold: { fontWeight: "bold" },
  viewRow: { flexDirection: "row", borderBottom: "1pt solid black", minHeight: 180 },
  viewLabel: { width: 75, borderRight: "1pt solid black", paddingVertical: 4, paddingHorizontal: 2, fontSize: 8.5, justifyContent: "center" },
  viewImg: { flex: 1, padding: 8, alignItems: "center", justifyContent: "center" },
  img: { width: "auto", height: 150, objectFit: "contain" },
  noteRow: { padding: 5, fontSize: 8 },
});

const DISCLOSURE_VIEWS = [
  { id: "perspective", label: "Perspective view" },
  { id: "front", label: "Front view" },
  { id: "back", label: "Rear/Back View" },
  { id: "top", label: "Top View" },
  { id: "bottom", label: "Bottom View" },
  { id: "left", label: "Left Hand Side View" },
  { id: "right", label: "Right Hand Side View" },
];

const DisclosureDocument = ({ d }: { d: any }) => (
  <Document>
    <Page size="A4" style={dStyles.page}>
      <Text style={dStyles.title}>DESIGN REGISTRATION</Text>
      <Text style={dStyles.formName}>PRELIMINARY INFORMATION FORM</Text>
      <Text style={dStyles.subtitle}>(PLEASE TYPE OR PRINT LEGIBLY)</Text>

      <View style={dStyles.table}>
        {/* INFORMATION ROWS */}
        <View style={dStyles.row}>
          <View style={dStyles.labelCell}><Text>Full name and address of the applicant/s</Text></View>
          <View style={dStyles.valueCell}>
            {(d.applicants as any[]).map((a: any, i: number) => (<Text key={i}>{i + 1}. {a.name}{a.address ? ", " + a.address : ""}</Text>))}
          </View>
        </View>
        <View style={dStyles.row}><View style={dStyles.labelCell}><Text>Nationality of the Applicant/s</Text></View><View style={dStyles.valueCell}><Text>{d.nationality || "—"}</Text></View></View>
        <View style={dStyles.row}><View style={dStyles.labelCell}><Text>Category of applicant</Text></View><View style={dStyles.valueCell}><Text>{d.category || "—"}</Text></View></View>
        <View style={dStyles.row}><View style={dStyles.labelCell}><Text>GST No.</Text></View><View style={dStyles.valueCell}><Text>{d.gst || "—"}</Text></View></View>
        <View style={dStyles.row}>
          <View style={dStyles.labelCell}><Text>Contact details</Text></View>
          <View style={[dStyles.valueCell, { padding: 0 }]}>
            <View style={{ padding: 5 }}>
              {d.institution ? <Text>{d.institution}</Text> : null}
              {d.address ? <Text>{d.address}</Text> : null}
            </View>
            <View style={{ borderTop: "1pt solid black", padding: 5 }}>
              <Text><Text style={dStyles.bold}>Email: </Text>{d.emails || "—"}</Text>
            </View>
            <View style={{ borderTop: "1pt solid black", padding: 5 }}>
              <Text><Text style={dStyles.bold}>Cell Phone No: </Text>{d.phones || "—"}</Text>
            </View>
            <View style={{ borderTop: "1pt solid black", padding: 5 }}>
              <Text><Text style={dStyles.bold}>Landline No.: </Text>{d.landline || "N/A"}</Text>
            </View>
            <View style={{ borderTop: "1pt solid black", padding: 5 }}>
              <Text><Text style={dStyles.bold}>Fax (if any): </Text>{d.fax || "N/A"}</Text>
            </View>
          </View>
        </View>
        <View style={dStyles.row}>
          <View style={dStyles.labelCell}><Text>Name / Title or Description of the article to be protected in less than 15 words</Text></View>
          <View style={[dStyles.valueCell, { justifyContent: "center", alignItems: "center" }]}><Text style={[dStyles.bold, { fontSize: 10, textAlign: "center" }]}>{d.articleTitle || "—"}</Text></View>
        </View>
        <View style={dStyles.row}>
          <View style={dStyles.labelCell}><Text>Description of article, functionality and advantages of the article (Max 200 words)</Text></View>
          <View style={[dStyles.valueCell, { textAlign: "justify" }]}>
            {d.descText ? <Text style={{ marginBottom: 6 }}>{d.descText}</Text> : null}
            {d.functionality || (d.keyFeatures && d.keyFeatures.length > 0) ? (
              <View style={{ marginTop: 4 }}>
                <Text style={[dStyles.bold, { marginBottom: 3, textDecoration: "underline" }]}>Functionalities:</Text>
                {d.functionality ? <Text style={{ marginBottom: 4 }}>{d.functionality}</Text> : null}
                {(d.keyFeatures as string[]).map((f: string, i: number) => (
                  <Text key={i} style={{ marginLeft: 8, marginBottom: 2 }}>• {f}</Text>
                ))}
              </View>
            ) : null}
          </View>
        </View>
        <View style={dStyles.row}>
          <View style={dStyles.labelCell}><Text>Please provide photographs or drawings of the article to be protected as a novel design.</Text></View>
          <View style={dStyles.valueCell}><Text>Paste the appropriate views in the below mentioned fields</Text></View>
        </View>

        {/* VIEWS SECTION — Immediately follows info */}
        {DISCLOSURE_VIEWS.map((v, i) => (
          <View key={v.id} wrap={false} style={[
            { flexDirection: "row", borderBottom: "1pt solid black", minHeight: 60 },
          ]}>
            <View style={[dStyles.labelCell, { justifyContent: "center" }]}><Text>{v.label}</Text></View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 12 }}>
              {d.views[v.id] ? (
                <PDFImage src={d.views[v.id]} style={{ width: "90%", maxHeight: 200, objectFit: "contain" }} />
              ) : (
                <Text style={{ color: "grey", fontSize: 9, fontStyle: "italic", marginBottom: 8 }}>VIEW {i + 1} EMPTY</Text>
              )}
              <Text style={[dStyles.bold, { marginTop: 4, textDecoration: "underline", fontSize: 7.5 }]}>{v.label}</Text>
            </View>
          </View>
        ))}

        {/* NOTE SECTION */}
        <View style={dStyles.row} wrap={false}>
          <View style={[dStyles.valueCell, { padding: 8 }]}>
            <Text style={{ fontSize: 8.5 }}>
              <Text style={dStyles.bold}>NOTE: </Text>
              4 sets of photographs of each of the views (1-7) of the article should be provided for design registration application.
            </Text>
          </View>
        </View>
        <View style={dStyles.row} wrap={false}>
          <View style={[dStyles.valueCell, { padding: 8 }]}>
            <Text style={{ fontSize: 8.5 }}>Duly executed Power of Authority by the applicant or the authorized signatory.</Text>
            <Text style={{ fontSize: 8.5 }}>Please note that the Power of Authority is not required to be legalized or notarized.</Text>
          </View>
        </View>
        <View wrap={false} style={{ padding: 5 }}>
          <Text style={{ textAlign: "center", marginTop: 8, fontWeight: "bold" }}>*******</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// PDF Component
const PatentDocument = ({ productName, dated, views, authors }: any) => (
  <Document>
    {PATENT_VIEWS.map((view, index) => (
      <Page key={view.id} size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.docTitle}>The Designs Act, 2000</Text>

        <View style={pdfStyles.headerBox}>
          <View style={pdfStyles.headerLeft}>
            <Text style={pdfStyles.boldText}>NAME OF THE APPLICANTS: {authors.map((a: any) => (a.name || "").toUpperCase()).join(", ") || "________________"}</Text>
          </View>
          <View style={pdfStyles.headerRight}>
            <Text style={pdfStyles.boldText}>Total Sheet: 7</Text>
            <Text style={pdfStyles.boldText}>Sheet No: {index + 1}</Text>
          </View>
        </View>

        <View style={pdfStyles.viewContainer}>
          {views[view.id] && <PDFImage src={views[view.id]} style={pdfStyles.viewImage} />}
        </View>

        <Text style={pdfStyles.viewLabel}>{view.label}</Text>

        <View style={pdfStyles.noveltyBlock}>
          <Text style={pdfStyles.paragraph}>The novelty resides in the shape and configuration of the <Text style={pdfStyles.boldText}>"{productName || "________________"}"</Text>, as illustrated in the accompanying representations.</Text>
          <Text style={pdfStyles.paragraph}>No claim is made by virtue of this registration to any right to the exclusive use of the colour or colour combination appearing in the design.</Text>
          <Text style={pdfStyles.paragraph}>No claim is made by virtue of this registration in respect of any mechanical or other action of any mechanism whatsoever or in respect of any mode or principle of construction of the article.</Text>
          <Text style={pdfStyles.paragraph}>No claim is made by virtue of this registration to any right to the exclusive use of the words, letters, numbers, trademarks, or any other symbols appearing in the design.</Text>
        </View>

        <Text style={pdfStyles.dated}>Dated: {dated}</Text>

        <View style={pdfStyles.sigSection}>
          <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 3 }}>For,</Text>
          {authors.map((a: any) => (
            <View key={a.id} style={pdfStyles.sigRow}>
              <Text style={{ fontSize: 8, fontWeight: "bold" }}>{(a.name || "").toUpperCase()}</Text>
              {a.signature && <PDFImage src={a.signature} style={pdfStyles.sigImage} />}
            </View>
          ))}
        </View>

        <View style={pdfStyles.footer}>
          <Text>TO,</Text>
          <Text>THE CONTROLLER OF DESIGNS,</Text>
          <Text>THE PATENT OFFICE,</Text>
          <Text>KOLKATA</Text>
        </View>
      </Page>
    ))}
  </Document>
);

// FER PDF Component
const FerDocument = ({ data, authors }: any) => (
  <Document>
    <Page size="A4" style={dStyles.page}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: "bold" }}>TO,</Text>
        <Text style={{ fontWeight: "bold" }}>THE CONTROLLER OF DESIGNS,</Text>
        <Text style={{ fontWeight: "bold" }}>THE PATENT OFFICE,</Text>
        <Text style={{ fontWeight: "bold" }}>KOLKATA</Text>
      </View>

      <Text style={[dStyles.title, { marginBottom: 20 }]}>REPLY TO FIRST EXAMINATION REPORT</Text>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold" }}>Application No: <Text style={{ fontWeight: "normal" }}>{data.applicationNo || "________________"}</Text></Text>
        <Text style={{ fontWeight: "bold" }}>Dated: <Text style={{ fontWeight: "normal" }}>{data.dated || "________________"}</Text></Text>
      </View>

      <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Subject: <Text style={{ textDecoration: "underline" }}>{data.subject || "Reply to First Examination Report dated " + data.dated}</Text></Text>

      <Text style={{ textAlign: "justify", marginBottom: 10, lineHeight: 1.6 }}>Respected Sir/Madam,</Text>
      <Text style={{ textAlign: "justify", marginBottom: 20, lineHeight: 1.6 }}>
        {data.replyBody || "We refer to the First Examination Report issued for the above-mentioned design application. Our point-by-point reply to the objections raised is provided below for your kind consideration."}
      </Text>

      <View style={{ marginTop: 40, alignSelf: "flex-end", width: "40%" }}>
        <Text style={{ fontSize: 8, fontStyle: "italic", marginBottom: 5 }}>Yours faithfully,</Text>
        {authors.map((a: any) => (
          <View key={a.id} style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 7.5, fontWeight: "bold", textTransform: "uppercase" }}>{a.name}</Text>
            {a.signature && <PDFImage src={a.signature} style={{ height: 30, objectFit: "contain", marginTop: 2 }} />}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default function PatentDrafterPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [bgShapes, setBgShapes] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    // Generate shapes only on client to avoid hydration mismatch
    setBgShapes(Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 400 + 100,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * -25,
      opacity: Math.random() * 0.12 + 0.03, // Increased opacity for visibility
      rotate: Math.random() * 360,
      type: ["cube", "sphere", "pyramid", "node", "ring"][i % 5]
    })));
  }, []);

  const [productName, setProductName] = useState("");
  const [dated, setDated] = useState(`${new Date().getDate()} Day of ${new Date().toLocaleString('en-GB', { month: 'long' })} ${new Date().getFullYear()}`);
  const [views, setViews] = useState<Record<string, string | null>>({ perspective: null, front: null, back: null, left: null, right: null, top: null, bottom: null });
  const [authors, setAuthors] = useState([{ id: "1", name: "", signature: null as any }]);
  const [ferAuthors, setFerAuthors] = useState([{ id: "1", name: "", signature: null as any }]);
  const [currentSheet, setCurrentSheet] = useState(1);
  const [activeTab, setActiveTab] = useState<"general" | "ai">("general");
  const [docType, setDocType] = useState<"representation" | "disclosure" | "fer">("representation");

  // Onboarding & Payment Tunnel State
  const [selectedPackages, setSelectedPackages] = useState<Record<string, boolean>>({
    representation: false,
    disclosure: false,
    fer: false
  });
  const [isPackageSelected, setIsPackageSelected] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const calculatePrice = () => {
    let price = 0;
    const hasRep = selectedPackages.representation;
    const hasDisc = selectedPackages.disclosure;
    const hasFer = selectedPackages.fer;

    if (hasRep && hasDisc) {
      price += 249; // Combo offer
    } else {
      if (hasRep) price += 149;
      if (hasDisc) price += 149;
    }

    if (hasFer) {
      price += 49;
    }

    return price;
  };

  const hasAnySelected = Object.values(selectedPackages).some(Boolean);

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      
      // 1. Create a PatentDraft record in our database
      const resDraft = await createPatentDraft({
        productTitle: productName || "Patent Design Draft",
        locarnoClass: locarnoClass || "Class 15",
        locarnoSubclass: locarnoSubClass || "04",
        views: views,
        authors: authors,
        paymentAmount: calculatePrice()
      });

      if (resDraft.error || !resDraft.draftId) {
        alert(resDraft.error || "Failed to create draft record in database.");
        setPaymentProcessing(false);
        return;
      }

      // 2. Load Razorpay script
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Razorpay SDK failed to load."));
          document.body.appendChild(script);
        });
      }

      // 3. Create Razorpay payment order
      const resOrder = await createPatentPaymentOrder(calculatePrice(), resDraft.draftId);
      if (resOrder.error || !resOrder.success) {
        alert(resOrder.error || "Failed to generate payment order.");
        setPaymentProcessing(false);
        return;
      }

      // 4. Trigger Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_your_key_here",
        amount: resOrder.amount,
        currency: resOrder.currency,
        name: "KALVEX LABS",
        description: "AI Design Patent Drafting Suite",
        order_id: resOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment on the server
            const verifyRes = await verifyPatentPayment(response, resDraft.draftId, calculatePrice());
            if (verifyRes.success) {
              setIsPaid(true);
              setIsFinalized(false); // Close checkout modal
              alert("Payment successful! Your Patent Drafting Suite is now unlocked.");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("An error occurred during verification.");
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          email: session?.user?.email || "",
          name: session?.user?.name || "",
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error?.message || "Failed to initialize payment gateway.");
      setPaymentProcessing(false);
    }
  };



  // FER state
  const [ferAppNo, setFerAppNo] = useState("433579-001");
  const [ferSubject, setFerSubject] = useState("Response to First Examination Report");
  const [ferBody, setFerBody] = useState("");
  const [ferDate, setFerDate] = useState("2025-01-15");
  const [ferOfficeAddress, setFerOfficeAddress] = useState("The Patent Office,\nKolkata");
  const [ferIssueDate, setFerIssueDate] = useState("2025-01-13");
  const [ferSuffix, setFerSuffix] = useState("/D/YG /JKP");
  const [ferObjections, setFerObjections] = useState<any[]>([
    {
      id: "obj-1",
      objection: "Class-Sub Class Number should be stated appropriately with respect to the nature of article in Application Form 1 (Suggested: 23-08).",
      response: "Class-Sub Class Number is amended and stated appropriately with respect to the nature of article in Application Form 1 as 23-08."
    }
  ]);

  const formatDateIndian = (dateStr: string) => {
    if (!dateStr) return "";
    const normalized = dateStr.replace(/\//g, "-");
    const parts = normalized.split("-");
    if (parts.length !== 3) return dateStr;

    if (parts[0].length === 4) {
      // YYYY-MM-DD -> DD/MM/YYYY
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } else {
      // DD-MM-YYYY -> DD/MM/YYYY
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
  };

  const formatDateSuffix = (dateStr: string) => {
    if (!dateStr) return "";

    // 1. Literal manual YYYY-MM-DD or DD-MM-YYYY split parsing to bypass timezone shift completely
    const normalized = dateStr.replace(/\//g, "-");
    const parts = normalized.split("-");
    
    if (parts.length === 3) {
      let year = "";
      let monthIdx = -1;
      let day = -1;

      if (parts[0].length === 4) {
        // YYYY-MM-DD
        year = parts[0];
        monthIdx = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        // DD-MM-YYYY
        year = parts[2];
        monthIdx = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[0], 10);
      }

      if (!isNaN(day) && !isNaN(monthIdx) && monthIdx >= 0 && monthIdx <= 11 && day >= 1 && day <= 31) {
        let suffix = "th";
        if (day === 1 || day === 21 || day === 31) suffix = "st";
        else if (day === 2 || day === 22) suffix = "nd";
        else if (day === 3 || day === 23) suffix = "rd";

        const months = [
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ];
        return `${day}${suffix} ${months[monthIdx]}, ${year}`;
      }
    }

    // 2. Fallback to standard native UTC date parsing to remain timezone-independent
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();
      const monthIdx = date.getUTCMonth();

      let suffix = "th";
      if (day === 1 || day === 21 || day === 31) suffix = "st";
      else if (day === 2 || day === 22) suffix = "nd";
      else if (day === 3 || day === 23) suffix = "rd";

      const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];
      return `${day}${suffix} ${months[monthIdx]}, ${year}`;
    }

    return dateStr;
  };

  const getFERPages = () => {
    // 1. Calculate points to see if overflow is triggered
    const basePoints = 25; // Header, address, date, subject, salutation, intro text
    const closingPoints = 8; // Closing statement
    const thankYouPoints = 5; // Thank you
    const signaturePoints = 8 + ferAuthors.length * 6; // Base "For," plus each author row

    const objectionRows = ferObjections.map((obj) => {
      const objText = obj.objection || "";
      const resText = obj.response || "";
      const totalChars = objText.length + resText.length;
      return 12 + Math.ceil(totalChars / 80);
    });

    const attachedRowPoints = 10;
    const totalObjectionPoints = objectionRows.reduce((a, b) => a + b, 0);
    const grandTotalPoints = basePoints + totalObjectionPoints + attachedRowPoints + closingPoints + thankYouPoints + signaturePoints;

    const maxSinglePagePoints = 92;

    if (grandTotalPoints <= maxSinglePagePoints) {
      return [
        {
          pageNum: 1,
          type: "single",
          objections: ferObjections,
          showAttached: true,
          showHeader: true,
          showClosing: true,
          showSignature: true
        }
      ];
    } else {
      // Overflow! Let's partition objections between Page 1 and Page 2
      let p1Objections = [];
      let p2Objections = [];
      let currentP1Points = 0;

      for (let i = 0; i < ferObjections.length; i++) {
        const rowPts = objectionRows[i];
        // Ensure Page 1 has at least 1 objection if possible, and doesn't exceed its budget
        if (p1Objections.length === 0 || (currentP1Points + rowPts <= 70 && i < ferObjections.length - 1)) {
          p1Objections.push(ferObjections[i]);
          currentP1Points += rowPts;
        } else {
          p2Objections.push(ferObjections[i]);
        }
      }

      if (p2Objections.length === 0 && ferObjections.length > 1) {
        p2Objections.push(p1Objections.pop()!);
      }

      return [
        {
          pageNum: 1,
          type: "split-p1",
          objections: p1Objections,
          showAttached: false,
          showHeader: true,
          showClosing: false,
          showSignature: false
        },
        {
          pageNum: 2,
          type: "split-p2",
          objections: p2Objections,
          showAttached: true,
          showHeader: false,
          showClosing: true,
          showSignature: true
        }
      ];
    }
  };
  // Disclosure form state
  const [dApplicants, setDApplicants] = useState([{ id: "1", name: "", email: "", mobile: "" }]);
  const [dNationality, setDNationality] = useState("Indian");
  const [dCategory, setDCategory] = useState("Natural Person");
  const [dGst, setDGst] = useState("");
  const [dInstitution, setDInstitution] = useState("");
  const [dAddress, setDAddress] = useState("");
  const [dLandline, setDLandline] = useState("");
  const [dFax, setDFax] = useState("");
  const [dArticleTitle, setDArticleTitle] = useState("");
  const [dDescText, setDDescText] = useState("");
  const [dFunctionality, setDFunctionality] = useState("");
  const [dKeyFeatures, setDKeyFeatures] = useState([""]);
  const [dViews, setDViews] = useState<Record<string, string | null>>({
    perspective: null, front: null, back: null, top: null, bottom: null, left: null, right: null
  });

  // Derived from applicants
  const dAllEmails = dApplicants.map(a => a.email).filter(Boolean).join(", ");
  const dAllMobiles = dApplicants.map(a => a.mobile).filter(Boolean).join(", ");

  const dCombinedDescription = [
    dDescText ? `Description: ${dDescText}` : "",
    dFunctionality ? `Functionality: ${dFunctionality}` : "",
    dKeyFeatures.filter(Boolean).length ? `Key Features:\n${dKeyFeatures.filter(Boolean).map((f, i) => `${i + 1}. ${f}`).join("\n")}` : "",
  ].filter(Boolean).join("\n\n");

  const dTotalWords = dCombinedDescription.split(/\s+/).filter(Boolean).length;

  const dData = { applicants: dApplicants, nationality: dNationality, category: dCategory, gst: dGst, institution: dInstitution, address: dAddress, emails: dAllEmails, phones: dAllMobiles, landline: dLandline, fax: dFax, articleTitle: dArticleTitle, descText: dDescText, functionality: dFunctionality, keyFeatures: dKeyFeatures.filter(Boolean), views: dViews };

  const handleDView = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDViews(p => ({ ...p, [id]: ev.target?.result as string }));
    reader.readAsDataURL(file);
    (e.target as HTMLInputElement).value = "";
  };

  const [projectDescription, setProjectDescription] = useState("");
  const [locarnoClass, setLocarnoClass] = useState("");
  const [locarnoSubClass, setLocarnoSubClass] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<{ confidence: number, reasoning: string[] } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
        {/* 3D FLOATING BACKGROUND SHAPES */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {bgShapes.map((shape) => (
            <motion.div
              key={shape.id}
              initial={{
                x: `${shape.x}%`,
                y: `${shape.y}%`,
                rotate: shape.rotate,
                scale: 0.8
              }}
              animate={{
                y: [`${shape.y}%`, `${shape.y - 15}%`, `${shape.y}%`],
                x: [`${shape.x}%`, `${shape.x + 5}%`, `${shape.x}%`],
                rotate: shape.rotate + 360,
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{
                duration: shape.duration,
                repeat: Infinity,
                delay: shape.delay,
                ease: "linear"
              }}
              style={{
                position: 'absolute',
                width: shape.size,
                height: shape.size,
                opacity: shape.opacity,
              }}
              className="flex items-center justify-center"
            >
              {shape.type === "cube" && (
                <div className="w-full h-full border-[1.5px] border-slate-900/40 rounded-lg transform skew-x-12 bg-slate-900/[0.02]" />
              )}
              {shape.type === "sphere" && (
                <div className="w-full h-full border-[1.5px] border-slate-900/40 rounded-full bg-slate-900/[0.02]" />
              )}
              {shape.type === "pyramid" && (
                <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-slate-900/40" />
              )}
              {shape.type === "node" && (
                <div className="relative w-full h-full opacity-60">
                  <div className="absolute inset-0 border-[1.5px] border-slate-900 rotate-45" />
                  <div className="absolute inset-0 border-[1.5px] border-slate-900 -rotate-45" />
                </div>
              )}
              {shape.type === "ring" && (
                <div className="w-full h-full border-[3px] border-slate-900/30 rounded-full flex items-center justify-center">
                  <div className="w-1/2 h-1/2 border-[1.5px] border-slate-900/40 rounded-full" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  const handleUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>, type: 'view' | 'sig', authorId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'view') setViews(p => ({ ...p, [id]: result }));
      else setAuthors(p => p.map(a => a.id === authorId ? { ...a, signature: result } : a));
    };
    reader.readAsDataURL(file);
    const target = event?.target as HTMLInputElement;
    if (target) target.value = "";
  };

  const handleFerUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>, authorId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFerAuthors(p => p.map(a => a.id === authorId ? { ...a, signature: result } : a));
    };
    reader.readAsDataURL(file);
    const target = event?.target as HTMLInputElement;
    if (target) target.value = "";
  };

  const removeAuthor = (id: string) => {
    if (authors.length > 1) {
      setAuthors(p => p.filter(a => a.id !== id));
    }
  };

  const removeFerAuthor = (id: string) => {
    if (ferAuthors.length > 1) {
      setFerAuthors(p => p.filter(a => a.id !== id));
    }
  };

  const getAiRecommendation = async () => {
    if (!projectDescription) return;
    setIsAiLoading(true);
    setAiStatus([]);
    setAiResult(null);

    const log = (msg: string) => setAiStatus(prev => [...prev, msg]);

    log("Initializing KALVEX Neural Engine v2.0...");
    await new Promise(r => setTimeout(r, 600));

    log("Linguistic tokenization & intent analysis...");
    const result = await analyzePatent(projectDescription);
    await new Promise(r => setTimeout(r, 800));

    log("Cross-referencing Locarno Design Hierarchy...");
    await new Promise(r => setTimeout(r, 1000));

    log(`Decision Anchor: Class ${result.class}-${result.subclass}`);
    log(`Confidence Score: ${result.confidence}%`);

    setProductName(result.title);
    setLocarnoClass(result.class);
    setLocarnoSubClass(result.subclass);
    setAiResult({ confidence: result.confidence, reasoning: result.reasoning });

    log("Finalizing neural mapping...");
    await new Promise(r => setTimeout(r, 600));

    setIsAiLoading(false);
    // Stay on tab for a bit to show results
    setTimeout(() => {
      setActiveTab("general");
      setAiStatus([]);
    }, 2000);
  };

  if (isMounted && !isPackageSelected) {

    type PkgType = { id: string; title: string; subtitle: string; desc: string; badge: string; icon: string; accentColor: string; accentLight: string; };
    const CardInner = ({ pkg, isSelected }: { pkg: PkgType; isSelected: boolean }) => (
      <button
        onClick={() => { if (!isSelected) setSelectedPackages((prev: any) => ({ ...prev, [pkg.id]: true })); }}
        className="pkg-card relative w-full text-left bg-white p-6 flex flex-col cursor-pointer"
        style={{ borderRadius: '18px' }}
      >


        {/* X button */}
        {isSelected && (
          <button
            onClick={e => { e.stopPropagation(); setSelectedPackages((prev: any) => ({ ...prev, [pkg.id]: false })); }}
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
            aria-label="Remove"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1 1L8 8M8 1L1 8" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Icon + badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] font-black shadow-sm"
            style={{ background: pkg.accentLight, color: pkg.accentColor }}
          >
            {pkg.icon}
          </div>
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: pkg.accentLight, color: pkg.accentColor, border: `1px solid ${pkg.accentColor}30` }}
          >
            {pkg.badge}
          </span>
        </div>

        {/* Title + subtitle */}
        <div className="mb-2">
          <h4 className="font-bold text-[15px] text-slate-900 leading-snug tracking-tight">{pkg.title}</h4>
          <p className="text-[9.5px] font-semibold uppercase tracking-wider mt-0.5 text-slate-400">{pkg.subtitle}</p>
        </div>

        {/* Desc — accent colored */}
        <p className="text-slate-500 text-[11.5px] leading-relaxed font-normal flex-1 mb-4">{pkg.desc}</p>

        {/* Status row */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <div
            className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
            style={isSelected
              ? { background: pkg.accentColor, borderColor: pkg.accentColor }
              : { background: 'white', borderColor: '#cbd5e1' }}
          >
            {isSelected && (
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                <path d="M0.5 2.5L2.5 4.5L6.5 0.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-[10.5px] font-semibold text-slate-400">
            {isSelected ? 'Added to suite ✓' : 'Click to add'}
          </span>
        </div>
      </button>
    );

    const PACKAGES = [
      {
        id: "representation",
        title: "Representation Sheet",
        subtitle: "Official Design Views",
        desc: "Formats your perspective, plan, and elevation views inside official double-bordered design grids — ready for filing.",
        badge: "Most Essential",
        icon: "◈",
        accentColor: "#6366f1",
        accentLight: "#eef2ff",
      },
      {
        id: "disclosure",
        title: "Design Disclosure Form",
        subtitle: "Preliminary Information Statement",
        desc: "Constructs the complete claim statement, novelty points, and Locarno subclass description for official submission.",
        badge: "Recommended",
        icon: "◉",
        accentColor: "#0ea5e9",
        accentLight: "#f0f9ff",
      },
      {
        id: "fer",
        title: "Reply to FER",
        subtitle: "First Examination Report Response",
        desc: "Generates structured, office-compliant responses to all objections raised in the First Examination Report.",
        badge: "Prosecution Suite",
        icon: "◎",
        accentColor: "#10b981",
        accentLight: "#f0fdf4",
      }
    ];

    return (
      <div className="min-h-screen bg-[#f7f8fa] relative flex items-center justify-center overflow-hidden">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          @keyframes shimmer-move {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          .shimmer-text {
            background: linear-gradient(90deg, #4f46e5, #7c3aed, #db2777, #6366f1, #4f46e5);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer-move 4s linear infinite;
          }
          .pkg-card {
            transition: box-shadow 0.22s ease, transform 0.22s ease;
          }
          .pkg-card:hover, .pkg-card:active {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px -6px rgba(0,0,0,0.12);
          }
          @keyframes spin-border {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .card-anim-border-wrap {
            position: relative;
            border-radius: 20px;
            padding: 2px;
            overflow: hidden;
          }
          .card-anim-border-wrap::before {
            content: '';
            position: absolute;
            inset: 0;
            background: conic-gradient(from 0deg, #6366f1, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4, #6366f1);
            animation: spin-border 4s linear infinite;
            border-radius: 20px;
          }
          .card-anim-border-inner {
            position: relative;
            z-index: 1;
            background: white;
            border-radius: 18px;
            overflow: hidden;
          }
          @keyframes marquee-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            white-space: nowrap;
            animation: marquee-scroll 18s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Mobile marquee banner — visible only on screens smaller than lg */}
        <div className="lg:hidden w-full fixed top-16 left-0 right-0 z-50 overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-2 shadow-lg">
          <div className="marquee-track">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="text-white text-[10px] font-black uppercase tracking-widest px-8 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block flex-shrink-0" />
                🖥️ Best experienced on Laptop or Desktop &nbsp;&nbsp;•&nbsp;&nbsp;
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block flex-shrink-0" />
                AI Patent Drafter — Recommended: Use on Laptop for Full Experience &nbsp;&nbsp;•&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.4 }} />
          <div className="absolute -top-20 right-0 w-[420px] h-[420px] rounded-full bg-indigo-100/70 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-sky-100/60 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10 py-8 sm:py-16 lg:py-20 pt-20 lg:pt-20">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
              AI Patent Drafting Engine
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-black tracking-tight text-slate-900 leading-[1.05]">
              What would you like<br className="hidden sm:block" />{" "}
              <span className="shimmer-text">to draft today?</span>
            </h1>
            <p className="text-slate-400 text-[13px] font-normal max-w-sm mx-auto leading-relaxed pt-1">
              Click a card to select it. Tap × to remove. No pricing shown until you're ready.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {PACKAGES.map((pkg, i) => {
              const isSelected = selectedPackages[pkg.id];
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07 }}
                >
                  {isSelected ? (
                    /* Selected: solid accent border + glow */
                    <div
                      style={{
                        borderRadius: '20px',
                        boxShadow: `0 0 0 2.5px ${pkg.accentColor}, 0 14px 40px -8px ${pkg.accentColor}50`
                      }}
                    >
                      <CardInner pkg={pkg} isSelected={isSelected} />
                    </div>
                  ) : (
                    /* Unselected: spinning rainbow border */
                    <div className="card-anim-border-wrap">
                      <div className="card-anim-border-inner">
                        <CardInner pkg={pkg} isSelected={isSelected} />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Combo tag — no price */}
          {selectedPackages.representation && selectedPackages.disclosure && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-7">
              <span className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-600 px-4 py-1.5 rounded-full text-[11px] font-medium shadow-sm">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="5" fill="#10b981"/><path d="M2.5 5L4 6.5L7.5 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Combo offer applies for best value
              </span>
            </motion.div>
          )}

          {/* CTA */}
          <div className="flex flex-col items-center gap-2.5">
            <button
              disabled={!hasAnySelected}
              onClick={() => {
                if (!hasAnySelected) return;
                if (selectedPackages.representation) setDocType("representation");
                else if (selectedPackages.disclosure) setDocType("disclosure");
                else if (selectedPackages.fer) setDocType("fer");
                setIsPackageSelected(true);
              }}
              className="group flex items-center gap-2 px-9 py-3 rounded-xl font-semibold text-[13px] tracking-wide transition-all duration-200"
              style={hasAnySelected ? {
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                boxShadow: '0 8px 32px -6px rgba(99,102,241,0.4)',
                cursor: 'pointer'
              } : {
                background: '#f1f5f9',
                color: '#94a3b8',
                cursor: 'not-allowed'
              }}
            >
              {hasAnySelected ? 'Start Drafting' : 'Select at least one'}
              {hasAnySelected && <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
            </button>
            {hasAnySelected && (
              <p className="text-[11px] text-slate-400 font-normal">
                Full preview before any payment is required.
              </p>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-32 bg-slate-50 transition-colors duration-500 overflow-hidden relative print:bg-white print:pt-0 print:pb-0">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playball&family=Mrs+Saint+Delafield&family=Alex+Brush&family=Caveat&family=Satisfy&display=swap');
        
        .signature-cursive-1 { font-family: 'Great Vibes', cursive; font-size: 2rem; }
        .signature-cursive-2 { font-family: 'Playball', cursive; font-size: 1.6rem; }
        .signature-cursive-3 { font-family: 'Mrs Saint Delafield', cursive; font-size: 2.4rem; }
        .signature-cursive-4 { font-family: 'Alex Brush', cursive; font-size: 2rem; }
        .signature-cursive-5 { font-family: 'Caveat', cursive; font-size: 1.8rem; font-weight: bold; }
        .signature-cursive-6 { font-family: 'Satisfy', cursive; font-size: 1.6rem; }

        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-page {
            page-break-after: always !important;
            break-after: page !important;
            height: 297mm !important;
            width: 210mm !important;
            margin: 0 auto !important;
            padding: 2.5rem !important;
            border: none !important;
            box-shadow: none !important;
            position: relative !important;
            box-sizing: border-box !important;
          }
          .print-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>
      <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-blue-100/50 rounded-full -z-10 blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse no-print" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-100/50 rounded-full -z-10 blur-[100px] translate-y-1/3 -translate-x-1/4 animate-pulse no-print" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-24 space-y-8 no-print"
        >
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20">
            <Sparkles className="w-4 h-4" /> AI Patent Engineering
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-heading text-slate-900 leading-[0.9] tracking-tighter">
            Draft Like a <br />
            <span className="text-blue-600">Pro Architect.</span>
          </h1>
          <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-3xl mx-auto">
            Our intelligent drafting engine generates production-grade IP documentation. Simply upload your technical views and witness the transformation.
          </p>
        </motion.div>

        {/* DOCUMENT TYPE SELECTOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-16 no-print"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-slate-200 rounded-3xl p-3 shadow-xl shadow-slate-900/5">
            <div className="flex flex-wrap justify-center items-center gap-2">
              {[
                { id: "representation", label: "Representation Sheet", icon: Layout },
                { id: "disclosure", label: "Design Disclosure Form", icon: FileImage },
                { id: "fer", label: "Reply to FER", icon: Zap },
              ].filter(({ id }) => selectedPackages[id]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setDocType(id as typeof docType)}
                  className={`relative flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${docType === id
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {docType === id && (
                    <motion.div
                      layoutId="docTypePill"
                      className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block" />
            <button
              onClick={() => setIsPackageSelected(false)}
              className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-100 hover:border-slate-200 px-4 py-2.5 rounded-xl transition-all"
            >
              ← Change Selection
            </button>
          </div>
        </motion.div>

        {docType === "representation" ? (
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-900/5 transition-all">
                <h2 className="text-2xl font-black mb-10 flex items-center gap-4 font-heading text-slate-900 uppercase tracking-tight">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  Drafting Terminal
                </h2>

                <div className="flex gap-2 mb-8 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                  <button
                    onClick={() => setActiveTab("general")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "general" ? "bg-white text-blue-600 shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
                  >
                    <Layout className="w-4 h-4" /> General Info
                  </button>
                  <button
                    onClick={() => setActiveTab("ai")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "ai" ? "bg-white text-blue-600 shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
                  >
                    <BrainCircuit className="w-4 h-4" /> AI Insights
                  </button>
                </div>

                {activeTab === "general" ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Name</label>
                        <input value={productName} onChange={e => setProductName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-sm" placeholder="e.g. AI-Based Detection System" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filing Date</label>
                        <input value={dated} onChange={e => setDated(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Locarno Class</label>
                        <input value={locarnoClass} onChange={e => setLocarnoClass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-sm" placeholder="e.g. 14" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sub-Class</label>
                        <input value={locarnoSubClass} onChange={e => setLocarnoSubClass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-800 transition-all shadow-sm" placeholder="e.g. 04" />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {PATENT_VIEWS.map(v => (
                        <label key={v.id} className="cursor-pointer group/view">
                          <div className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-1 transition-all ${views[v.id] ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 bg-slate-50"}`}>
                            {views[v.id] ? (
                              <>
                                <img src={views[v.id]!} className="w-full h-full object-contain rounded-xl" alt="v" />
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViews(p => ({ ...p, [v.id]: null })); }}
                                  className="absolute -top-3 -right-3 bg-white text-red-500 border border-red-100 rounded-full p-1.5 shadow-xl hover:bg-red-50 hover:scale-110 transition-all z-10"
                                >
                                  <Plus className="w-4 h-4 rotate-45" />
                                </button>
                              </>
                            ) : (
                              <div className="text-center">
                                <FileImage className="w-5 h-5 mx-auto text-slate-300 mb-2 group-hover/view:text-blue-500 transition-colors" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{v.id}</span>
                              </div>
                            )}
                          </div>
                          <input type="file" className="hidden" onClick={e => e.stopPropagation()} onChange={e => handleUpload(v.id, e, 'view')} />
                        </label>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Applicants Order</h3>
                        <Button variant="ghost" size="sm" onClick={() => setAuthors([...authors, { id: Date.now().toString(), name: "", signature: null }])} className="text-blue-600 font-bold h-8"><Plus className="w-3 h-3 mr-1" /> Add Applicant</Button>
                      </div>

                      <Reorder.Group axis="y" values={authors} onReorder={setAuthors} className="space-y-3">
                        {authors.map((a) => (
                          <Reorder.Item key={a.id} value={a} className="flex gap-3 items-center bg-white p-2 pl-4 rounded-2xl border border-slate-100 shadow-md shadow-slate-100 cursor-default group/author transition-all">
                            <GripVertical className="w-5 h-5 text-slate-300 group-hover/author:text-slate-400 transition-colors cursor-grab active:cursor-grabbing shrink-0" />
                            <input value={a.name} onChange={e => setAuthors(p => p.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))} placeholder="Full Name" className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm uppercase font-black text-slate-800 focus:border-blue-400 focus:ring-4 ring-blue-500/10 outline-none transition-all" />

                            <label className={`cursor-pointer rounded-xl px-4 py-3 text-[10px] font-black tracking-widest transition-all shrink-0 whitespace-nowrap flex items-center gap-2 ${a.signature ? "bg-green-50 text-green-600 border border-green-200" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"}`} onClick={e => e.stopPropagation()}>
                              {a.signature ? <><CheckCircle2 className="w-3 h-3" /> Signed</> : "Upload Sign"}
                              <input type="file" className="hidden" onChange={e => handleUpload(a.id, e, 'sig', a.id)} />
                            </label>

                            {a.signature && (
                              <div className="relative group shrink-0">
                                <img src={a.signature} className="w-10 h-10 rounded-lg border border-slate-200 bg-white object-contain" alt="s" />
                                <button
                                  onClick={() => setAuthors(p => p.map(x => x.id === a.id ? { ...x, signature: null } : x))}
                                  className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110 transition-all"
                                >
                                  <Plus className="w-3 h-3 rotate-45" />
                                </button>
                              </div>
                            )}
                            <button onClick={() => removeAuthor(a.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Zap className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Patent Intelligence</h3>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technical Description</label>
                        <textarea
                          value={projectDescription}
                          onChange={e => setProjectDescription(e.target.value)}
                          placeholder="Describe your invention's core functionality, field of use, and key technical features..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 outline-none font-medium text-slate-700 transition-all min-h-[200px] resize-none leading-relaxed shadow-sm"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={getAiRecommendation}
                      disabled={isAiLoading || !projectDescription}
                      className="w-full py-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 group relative overflow-hidden transition-all"
                    >
                      {isAiLoading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-[8px] opacity-80">Processing Neural Mapping</span>
                        </div>
                      ) : (
                        <span className="relative z-10 flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Generate Recommendations
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                    </Button>

                    {aiResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 border border-blue-100 shadow-2xl shadow-blue-900/5"
                      >
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-blue-100/50">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                            <span className="text-blue-900 font-black text-xs uppercase tracking-widest">Neural Recommendation Active</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">Confidence Score</span>
                            <span className="text-3xl font-black text-blue-600">{aiResult.confidence}%</span>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Synthesized Title</span>
                            <span className="text-slate-800 font-black text-lg leading-tight">"{productName}"</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Assigned Class</span>
                              <span className="text-slate-800 font-black text-2xl">{locarnoClass}</span>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Sub-Class</span>
                              <span className="text-slate-800 font-black text-2xl">{locarnoSubClass}</span>
                            </div>
                          </div>

                          <div className="pt-6">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-4">AI Reasoning Path</span>
                            <div className="space-y-3 mb-6">
                              {aiResult.reasoning.map((r, i) => (
                                <div key={i} className="flex items-start gap-3 text-xs font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-50">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                  {r}
                                </div>
                              ))}
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                              <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest">
                                Note: These are neural-generated recommendations for institutional guidance only.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex gap-4">
                      <Info className="w-5 h-5 text-blue-600 shrink-0" />
                      <p className="text-[11px] font-bold text-blue-900/70 leading-relaxed uppercase tracking-tighter">
                        Our AI will suggest a formal **Locarno Class** (Industrial Design classification) and an **Institutional-grade Title** based on your technical input.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-[480px] shrink-0 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2"><Layout className="w-4 h-4 text-blue-600" /> Live Preview</h3>
                <div className="flex gap-3">
                  <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black outline-none shadow-sm text-slate-700 hover:border-slate-300 transition-colors" value={currentSheet} onChange={e => setCurrentSheet(parseInt(e.target.value))}>
                    {PATENT_VIEWS.map((_, i) => <option key={i} value={i + 1}>Sheet {i + 1}</option>)}
                  </select>
                  {isPaid ? (
                    <PDFDownloadLink document={<PatentDocument productName={productName} dated={dated} views={views} authors={authors} />} fileName="Patent_Document.pdf">
                      {({ loading }) => <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4 mr-2" /> Download</>}</Button>}
                    </PDFDownloadLink>
                  ) : (
                    <button
                      onClick={() => setIsFinalized(true)}
                      className="relative group rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest text-white flex items-center gap-2 overflow-hidden shadow-lg"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)', boxShadow: '0 8px 25px -5px rgba(139,92,246,0.5)' }}
                    >
                      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Sparkles className="w-3.5 h-3.5 relative z-10" />
                      <span className="relative z-10">Complete &amp; Get Pricing</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white shadow-2xl border border-slate-300 w-full min-h-[640px] p-6 pt-4 font-serif flex flex-col overflow-hidden">
                <div className="text-center mb-2 border-b border-black pb-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest underline underline-offset-2">The Designs Act, 2000</h4>
                </div>

                <div className="flex border border-black mb-2">
                  <div className="flex-[3] border-r border-black p-2 text-[8px] font-bold uppercase leading-tight">
                    NAME OF THE APPLICANTS: <span className="font-normal">{authors.filter(a => a.name).map(a => a.name).join(", ") || "____________________"}</span>
                  </div>
                  <div className="flex-[1] p-2 text-[8px] font-bold flex flex-col justify-center items-center">
                    <p>Total Sheet: 7</p>
                    <p>Sheet No: {currentSheet}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center py-1 mb-2">
                  <div className="w-full h-[140px] flex items-center justify-center mb-1 border border-slate-50">
                    {views[PATENT_VIEWS[currentSheet - 1].id] ? <img src={views[PATENT_VIEWS[currentSheet - 1].id]!} className="h-full object-contain" alt="v" /> : <div className="text-slate-100 flex flex-col items-center"><ImageIcon className="w-8 h-8 opacity-10" /><span className="text-[6px] italic uppercase">Upload {PATENT_VIEWS[currentSheet - 1].id}</span></div>}
                  </div>
                  <h5 className="text-[10px] font-bold uppercase underline underline-offset-2 mb-1 tracking-wider">{PATENT_VIEWS[currentSheet - 1].label}</h5>
                </div>

                <div className="text-[8px] leading-relaxed text-justify space-y-1.5 mb-6">
                  <p>The novelty resides in the shape and configuration of the <span className="font-bold uppercase">"{productName || "____________________"}"</span>, as illustrated in the accompanying representations.</p>
                  <p>No claim is made by virtue of this registration to any right to the exclusive use of the colour or colour combination appearing in the design.</p>
                  <p>No claim is made by virtue of this registration in respect of any mechanical or other action of any mechanism whatsoever or in respect of any mode or principle of construction of the article.</p>
                  <p>No claim is made by virtue of this registration to any right to the exclusive use of the words, letters, numbers, trademarks, or any other symbols appearing in the design.</p>
                  <p className="font-bold">Dated: {dated}</p>
                </div>

                <div className="flex justify-end mb-4 mt-2">
                  <div className="w-fit min-w-[150px] max-w-[280px] space-y-1.5 text-left">
                    <p className="text-[9px] font-bold text-slate-950 font-serif" style={{ fontFamily: "'Times New Roman', Times, serif" }}>For,</p>
                    {authors.map(a => (
                      <div key={a.id} className="flex items-center gap-3 py-0.5">
                        <span className="text-[8px] font-bold uppercase text-slate-950 whitespace-nowrap">{a.name || "________________"}</span>
                        {a.signature && <img src={a.signature} className="h-6 object-contain mix-blend-multiply" alt="s" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[8px] font-bold uppercase text-black leading-normal text-left mb-2 mt-auto">
                  <p>TO,</p>
                  <p>THE CONTROLLER OF DESIGNS,</p>
                  <p>THE PATENT OFFICE,</p>
                  <p>KOLKATA</p>
                </div>
              </div>
            </div>
          </div>
        ) : docType === "disclosure" ? (
          /* ── DESIGN DISCLOSURE FORM ── */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-16 items-start w-full">

            {/* LEFT: INPUT FORM */}
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-900/5 space-y-8">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white"><FileImage className="w-5 h-5" /></div>
                  Design Disclosure Form
                </h2>

                {/* Applicants */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applicant/s</label>
                    <button onClick={() => setDApplicants(p => [...p, { id: Date.now().toString(), name: "", email: "", mobile: "" }])} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:opacity-70"><Plus className="w-3 h-3" /> Add</button>
                  </div>
                  <Reorder.Group axis="y" values={dApplicants} onReorder={setDApplicants} className="space-y-3">
                    {dApplicants.map((a, i) => (
                      <Reorder.Item key={a.id} value={a} className="bg-white border border-slate-200 rounded-2xl p-3 space-y-2 shadow-sm relative group/applicant transition-all active:shadow-lg active:scale-[1.01]">
                        <div className="flex gap-2 items-center">
                          <GripVertical className="w-5 h-5 text-slate-300 group-hover/applicant:text-slate-400 transition-colors cursor-grab active:cursor-grabbing shrink-0" />
                          <span className="text-[10px] font-black text-slate-400 w-4 shrink-0">{i + 1}.</span>
                          <input
                            value={a.name}
                            onChange={e => setDApplicants(p => p.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))}
                            placeholder="Full Name"
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
                          />
                          {dApplicants.length > 1 && (
                            <button onClick={() => setDApplicants(p => p.filter(x => x.id !== a.id))} className="text-red-400 hover:text-red-600 p-1.5 shrink-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pl-6">
                          <input
                            value={a.email}
                            onChange={e => setDApplicants(p => p.map(x => x.id === a.id ? { ...x, email: e.target.value } : x))}
                            placeholder="Email Address"
                            type="email"
                            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 w-full"
                          />
                          <input
                            value={a.mobile}
                            onChange={e => setDApplicants(p => p.map(x => x.id === a.id ? { ...x, mobile: e.target.value } : x))}
                            placeholder="Mobile No."
                            type="tel"
                            className="flex-[0.7] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 w-full"
                          />
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>

                {/* Nationality + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality</label>
                    <input value={dNationality} onChange={e => setDNationality(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select value={dCategory} onChange={e => setDCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500">
                      <option>Natural Person</option><option>Company</option><option>University</option><option>Government</option><option>Other</option>
                    </select>
                  </div>
                </div>

                {/* GST */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST No. (optional)</label>
                  <input value={dGst} onChange={e => setDGst(e.target.value)} placeholder="e.g. 27AAAAA0000A1Z5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                </div>

                {/* Contact */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Details</label>
                  <input value={dInstitution} onChange={e => setDInstitution(e.target.value)} placeholder="Institution / Department" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                  <textarea value={dAddress} onChange={e => setDAddress(e.target.value)} placeholder="Full Address" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 resize-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Landline No. <span className="text-slate-300">(Optional)</span></label>
                      <input value={dLandline} onChange={e => setDLandline(e.target.value)} placeholder="(02423) 222862" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fax No. <span className="text-slate-300">(Optional)</span></label>
                      <input value={dFax} onChange={e => setDFax(e.target.value)} placeholder="(02423) 222682" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1"><Info className="w-3 h-3" /> Email & Mobile are auto-filled from applicant details above</p>
                </div>

                {/* Article Title */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Article Title <span className="text-slate-300">(max 15 words)</span></label>
                    <span className={`text-[10px] font-black ${dArticleTitle.split(" ").filter(Boolean).length > 15 ? "text-red-500" : "text-slate-300"}`}>{dArticleTitle.split(" ").filter(Boolean).length}/15</span>
                  </div>
                  <input value={dArticleTitle} onChange={e => setDArticleTitle(e.target.value)} placeholder="e.g. AI-Based Wild Animal Detection and Alert System" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                </div>

                {/* Description — 3 structured sections */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description, Functionality & Key Features <span className="text-slate-300">(combined max 200 words)</span></label>
                    <span className={`text-[10px] font-black tabular-nums ${dTotalWords > 200 ? "text-red-500" : dTotalWords > 160 ? "text-orange-400" : "text-slate-300"}`}>{dTotalWords}/200</span>
                  </div>

                  {/* Description sub-field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />Description</label>
                    <textarea
                      value={dDescText}
                      onChange={e => setDDescText(e.target.value)}
                      rows={3}
                      placeholder="Brief overview of the design — shape, components, what it is..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Functionality sub-field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />Functionality</label>
                    <textarea
                      value={dFunctionality}
                      onChange={e => setDFunctionality(e.target.value)}
                      rows={3}
                      placeholder="How the device operates, its working mechanism..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Key Features numbered list */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />Key Features <span className="text-slate-300 ml-1">({dKeyFeatures.length}/6)</span></label>
                      <button
                        onClick={() => dKeyFeatures.length < 6 && setDKeyFeatures(p => [...p, ""])}
                        disabled={dKeyFeatures.length >= 6}
                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${dKeyFeatures.length >= 6 ? "text-slate-300 cursor-not-allowed" : "text-blue-600 hover:opacity-70"}`}
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    {dKeyFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-400 w-5 text-right shrink-0">{i + 1}.</span>
                        <input
                          value={f}
                          onChange={e => setDKeyFeatures(p => p.map((x, idx) => idx === i ? e.target.value : x))}
                          placeholder={`Feature ${i + 1}`}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-blue-500"
                        />
                        {dKeyFeatures.length > 1 && (
                          <button onClick={() => setDKeyFeatures(p => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 p-1.5">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Uploads */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Design Views (7 required)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {DISCLOSURE_VIEWS.map(v => (
                      <label key={v.id} className="cursor-pointer group/view">
                        <div className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-1 transition-all ${dViews[v.id] ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 bg-slate-50"}`}>
                          {dViews[v.id] ? (
                            <>
                              <img src={dViews[v.id]!} className="w-full h-full object-contain rounded-xl" alt="v" />
                              <button onClick={e => { e.preventDefault(); e.stopPropagation(); setDViews(p => ({ ...p, [v.id]: null })); }} className="absolute -top-3 -right-3 bg-white text-red-500 border border-red-100 rounded-full p-1.5 shadow-xl hover:scale-110 z-10"><Plus className="w-3 h-3 rotate-45" /></button>
                            </>
                          ) : (
                            <div className="text-center">
                              <FileImage className="w-4 h-4 mx-auto text-slate-300 mb-1" />
                              <span className="text-[7px] font-black text-slate-400 uppercase leading-none">{v.id}</span>
                            </div>
                          )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleDView(v.id, e)} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE PREVIEW */}
            <div className="lg:w-[420px] shrink-0 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2"><Layout className="w-4 h-4 text-blue-600" /> Live Preview</h3>
                {isPaid ? (
                  <PDFDownloadLink document={<DisclosureDocument d={dData} />} fileName="Design_Disclosure_Form.pdf">
                    {({ loading }) => <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4 mr-2" />Download</>}</Button>}
                  </PDFDownloadLink>
                ) : (
                  <button
                    onClick={() => setIsFinalized(true)}
                    className="relative group rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest text-white flex items-center gap-2 overflow-hidden shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)', boxShadow: '0 8px 25px -5px rgba(139,92,246,0.5)' }}
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Complete &amp; Get Pricing</span>
                  </button>
                )}
              </div>

              <div className="overflow-y-auto max-h-[80vh] space-y-8 pr-1 pb-10 w-full overflow-x-auto custom-scrollbar select-none">
                <div className="relative group min-w-[550px] lg:min-w-0">
                  <div className="absolute -top-3 left-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full z-10 shadow-lg border border-slate-700">
                    Live Document Preview — Auto-flowing A4
                  </div>
                  <div className="bg-white shadow-2xl border border-slate-200 w-full p-6 sm:p-10 pt-12 font-serif text-[8.5px] leading-relaxed transition-all group-hover:shadow-blue-500/5">
                    <p className="text-center font-bold underline text-[12px] mb-0.5 text-slate-900 uppercase tracking-wide">DESIGN REGISTRATION</p>
                    <p className="text-center text-[10px] mb-1 text-slate-900 uppercase">PRELIMINARY INFORMATION FORM</p>
                    <p className="text-center mb-8 text-[8.5px] text-slate-900 font-serif uppercase tracking-tight">(PLEASE TYPE OR PRINT LEGIBLY)</p>

                    <table className="w-full border-collapse border border-black text-black">
                      <tbody>
                        <tr className="border border-black">
                          <td className="border border-black p-1 w-[75pt] align-top">Full name and address of the applicant/s</td>
                          <td className="border border-black p-1.5">
                            {dApplicants.map((a, i) => (
                              <div key={a.id} className="mb-0.5">{i + 1}. {a.name}{(a as any).address ? `, ${(a as any).address}` : ""}</div>
                            ))}
                          </td>
                        </tr>
                        <tr className="border border-black">
                          <td className="border border-black p-1 w-[75pt] font-normal">Nationality of the Applicant/s</td>
                          <td className="border border-black p-1.5">{dNationality}</td>
                        </tr>
                        <tr className="border border-black">
                          <td className="border border-black p-1 w-[75pt] font-normal">Category of applicant</td>
                          <td className="border border-black p-1.5">{dCategory}</td>
                        </tr>
                        <tr className="border border-black">
                          <td className="border border-black p-1 w-[75pt] font-normal">GST No.</td>
                          <td className="border border-black p-1.5 font-mono">{dGst || "—"}</td>
                        </tr>
                        <tr className="border border-black">
                          <td className="border border-black p-1 w-[75pt] align-top">Contact details</td>
                          <td className="border border-black p-0">
                            <div className="p-1 min-h-[40px]">
                              {dInstitution && <div>{dInstitution}</div>}
                              {dAddress && <div>{dAddress}</div>}
                            </div>
                            <div className="border-t border-black p-1">
                              <span className="font-bold">Email:</span> <span className="text-blue-600 underline">{dAllEmails || "—"}</span>
                            </div>
                            <div className="border-t border-black p-1">
                              <span className="font-bold">Cell Phone No:</span> {dAllMobiles || "—"}
                            </div>
                            <div className="border-t border-black p-1">
                              <span className="font-bold">Landline No.:</span> {dLandline || "N/A"}
                            </div>
                            <div className="border-t border-black p-1">
                              <span className="font-bold">Fax (if any):</span> {dFax || "N/A"}
                            </div>
                          </td>
                        </tr>
                        <tr className="border border-black">
                          <td className="border border-black p-1 w-[75pt] align-top text-[8px]">Name / Title or Description of the article to be protected in less than 15 words</td>
                          <td className="border border-black p-2 text-center align-middle font-bold text-[12px] text-slate-900">
                            {dArticleTitle || "—"}
                          </td>
                        </tr>
                        <tr className="border border-black">
                          <td className="border border-black p-1 w-[75pt] align-top">Description of article, functionality and advantages of the article (Max 200 words)</td>
                          <td className="border border-black p-2 align-top leading-relaxed text-justify space-y-1">
                            {dDescText && <div>{dDescText}</div>}
                            {(dFunctionality || dKeyFeatures.filter(Boolean).length > 0) && (
                              <div className="pt-2">
                                {dFunctionality && <div className="mb-2">{dFunctionality}</div>}
                                <div className="font-bold underline mb-1 flex items-center gap-1">⚙️ Functionalities:</div>
                                {dKeyFeatures.filter(Boolean).map((f, i) => <div key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500 font-bold">{f}</div>)}
                              </div>
                            )}
                          </td>
                        </tr>
                        <tr className="border border-black">
                          <td className="border border-black p-1.5 w-[115pt] align-top">Please provide photographs or drawings of the article to be protected as a novel design.</td>
                          <td className="border border-black p-1.5 text-slate-500 italic">Paste the appropriate views in the below mentioned fields</td>
                        </tr>

                        {/* VIEWS SECTION — Immediately follows Key Features */}
                        {DISCLOSURE_VIEWS.map((v, i) => (
                          <tr key={v.id} className="border border-black">
                            <td className="border border-black p-1 w-[75pt] align-middle font-bold text-[8px] whitespace-nowrap overflow-hidden">{i + 1}. {v.label}</td>
                            <td className="border border-black p-6 text-center align-middle min-h-[160px]">
                              <div className="flex flex-col items-center">
                                {dViews[v.id] ? (
                                  <img src={dViews[v.id]!} className="max-h-56 max-w-full mx-auto object-contain" alt={v.id} />
                                ) : (
                                  <div className="h-24 flex flex-col items-center justify-center opacity-20 mb-2">
                                    <FileImage className="w-8 h-8 mb-2" />
                                    <span className="italic text-[9px] font-bold uppercase tracking-widest">VIEW {i + 1} EMPTY</span>
                                  </div>
                                )}
                                <div className="font-bold underline mt-1 text-[7.5px] uppercase tracking-wide whitespace-nowrap">{v.label}</div>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {/* NOTE SECTION */}
                        <tr className="border border-black">
                          <td colSpan={2} className="p-2 border border-black">
                            <div className="text-[8.5px] leading-tight">
                              <span className="font-bold">NOTE: </span>
                              4 sets of photographs of each of the views (1-7) of the article should be provided for design registration application.
                            </div>
                          </td>
                        </tr>
                        <tr className="border border-black">
                          <td colSpan={2} className="p-2 border border-black">
                            <div className="text-[8.5px] leading-tight">
                              <div>Duly executed Power of Authority by the applicant or the authorized signatory.</div>
                              <div>Please note that the Power of Authority is not required to be legalized or notarized.</div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="flex flex-col items-center mt-4 opacity-40">
                      <span className="font-bold tracking-[0.6em] text-[10px]">*******</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── REPLY TO FER ── */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-16 items-start w-full print-area">
            {/* LEFT: INPUTS (Hidden on Print) */}
            <div className="flex-1 space-y-6 no-print w-full">
              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-900/5 space-y-8">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  FER Response Configurator
                </h2>

                {/* Recipient Header */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">1. Recipient & Date</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Document Date</label>
                      <input type="date" value={ferDate} onChange={(e) => setFerDate(e.target.value)} className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">FER Issue Date</label>
                      <input type="date" value={ferIssueDate} onChange={(e) => setFerIssueDate(e.target.value)} className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Case Reference */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">2. Suffix & Case References</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Design Application No.</label>
                      <input type="text" value={ferAppNo} onChange={(e) => setFerAppNo(e.target.value)} className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Office Suffix Code</label>
                      <input type="text" value={ferSuffix} onChange={(e) => setFerSuffix(e.target.value)} className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Objections Builder */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3. Objections & Answers</span>
                    <button
                      onClick={() => setFerObjections([...ferObjections, { id: `obj-${Date.now()}`, objection: "", response: "" }])}
                      className="text-blue-600 hover:opacity-75 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Row
                    </button>
                  </div>

                  <div className="space-y-4">
                    {ferObjections.map((obj, idx) => (
                      <div key={obj.id} className="border border-slate-200 bg-slate-50/20 rounded-2xl p-4 space-y-3 relative group shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Row #{idx + 1}</span>
                          {ferObjections.length > 1 && (
                            <button
                              onClick={() => setFerObjections(ferObjections.filter(o => o.id !== obj.id))}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            placeholder="Objection raised by Patent office..."
                            value={obj.objection}
                            onChange={(e) => {
                              setFerObjections(ferObjections.map(o => o.id === obj.id ? { ...o, objection: e.target.value } : o));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-bold"
                          />
                          <textarea
                            rows={2}
                            placeholder="Your Response / Argument..."
                            value={obj.response}
                            onChange={(e) => {
                              setFerObjections(ferObjections.map(o => o.id === obj.id ? { ...o, response: e.target.value } : o));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Draggable & Editable Expected Signees */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">4. Expected Signees (Draggable)</span>
                    <Button variant="ghost" size="sm" onClick={() => setFerAuthors([...ferAuthors, { id: Date.now().toString(), name: "", signature: null }])} className="text-blue-600 font-bold h-8"><Plus className="w-3 h-3 mr-1" /> Add Applicant</Button>
                  </div>

                  <Reorder.Group axis="y" values={ferAuthors} onReorder={setFerAuthors} className="space-y-3">
                    {ferAuthors.map((a) => (
                      <Reorder.Item key={a.id} value={a} className="flex gap-3 items-center bg-white p-2 pl-4 rounded-2xl border border-slate-100 shadow-md shadow-slate-100 cursor-default group/author transition-all">
                        <GripVertical className="w-5 h-5 text-slate-300 group-hover/author:text-slate-400 transition-colors cursor-grab active:cursor-grabbing shrink-0" />
                        <input value={a.name} onChange={e => setFerAuthors(p => p.map(x => x.id === a.id ? { ...x, name: e.target.value } : x))} placeholder="Full Name" className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm uppercase font-black text-slate-800 focus:border-blue-400 focus:ring-4 ring-blue-500/10 outline-none transition-all" />

                        <label className={`cursor-pointer rounded-xl px-4 py-3 text-[10px] font-black tracking-widest transition-all shrink-0 whitespace-nowrap flex items-center gap-2 ${a.signature ? "bg-green-50 text-green-600 border border-green-200" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"}`} onClick={e => e.stopPropagation()}>
                          {a.signature ? <><CheckCircle2 className="w-3 h-3" /> Signed</> : "Upload Sign"}
                          <input type="file" className="hidden" onChange={e => handleFerUpload(a.id, e, a.id)} />
                        </label>

                        {a.signature && (
                          <div className="relative group shrink-0">
                            <img src={a.signature} className="w-10 h-10 rounded-lg border border-slate-200 bg-white object-contain animate-in fade-in zoom-in duration-200" alt="s" />
                            <button
                              onClick={() => setFerAuthors(p => p.map(x => x.id === a.id ? { ...x, signature: null } : x))}
                              className="absolute -top-2 -right-2 bg-white border border-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110 transition-all"
                            >
                              <Plus className="w-3 h-3 rotate-45" />
                            </button>
                          </div>
                        )}
                        <button onClick={() => removeFerAuthor(a.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>

              </div>
            </div>

            {/* RIGHT: LIVE PREVIEW & EXPORT */}
            <div className="lg:w-[480px] shrink-0 sticky top-24 print-area w-full flex flex-col items-center">
              <div className="flex justify-between items-center mb-6 w-full max-w-[700px] no-print">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-blue-600" /> Live Preview
                </h3>
                {isPaid ? (
                  <Button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20"
                  >
                    <Printer className="w-4 h-4 mr-2" /> Print & Save PDF
                  </Button>
                ) : (
                  <button
                    onClick={() => setIsFinalized(true)}
                    className="relative group rounded-xl h-10 px-5 font-black text-[10px] uppercase tracking-widest text-white flex items-center gap-2 overflow-hidden shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)', boxShadow: '0 8px 25px -5px rgba(139,92,246,0.5)' }}
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Complete &amp; Get Pricing</span>
                  </button>
                )}
              </div>

              {/* Scrollable container for preview pages on screen */}
              <div className="w-full max-w-[700px] space-y-8 no-print overflow-y-auto max-h-[75vh] pr-1 pb-10 overflow-x-auto custom-scrollbar select-none">
                {getFERPages().map((page, pIdx, allPages) => (
                  <div key={page.pageNum} className="relative group min-w-[550px] lg:min-w-0">
                    <div className="absolute -top-3 left-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full z-10 shadow-lg border border-slate-700">
                      Page {page.pageNum} of {allPages.length}
                    </div>
                    
                    {/* Legal A4 emulation card */}
                    <div className="bg-white shadow-2xl border border-slate-300 w-full p-4 sm:p-8 md:p-10 font-serif text-[9.5px] leading-relaxed text-black relative aspect-[1/1.414] transition-all group-hover:shadow-blue-500/5 overflow-hidden flex flex-col justify-between">
                      
                      {/* Legal Correspondence Double-Border frame */}
                      <div className="absolute inset-4 border border-black pointer-events-none">
                        <div className="absolute inset-0.5 border-2 border-black" />
                      </div>

                      <div className="relative z-10 p-2 md:p-4 flex flex-col justify-between h-full space-y-3">
                        <div className="space-y-3">
                          {page.showHeader && (
                            <>
                              {/* Centered Document Header */}
                              <div className="text-center border-b border-slate-200 pb-1.5 mb-2">
                                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                                  Reply to First Examination Report (FER)
                                </h4>
                              </div>

                              {/* Top-Right aligned Date */}
                              <div className="text-right font-bold text-[9.5px]">
                                Date: {formatDateIndian(ferDate)}
                              </div>

                              {/* Left address block (Common, Hardcoded) */}
                              <div className="space-y-0.5 text-[9.5px] font-bold leading-tight text-left">
                                <p>To,</p>
                                <p>The Controller of Patent & Designs,</p>
                                <p>The Patent Office,</p>
                                <p>Kolkata</p>
                              </div>

                              {/* Bold Subject Line */}
                              <div className="text-[8.5px] font-bold text-left pt-1 leading-normal tracking-tight uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                                Subject: - Response to First Examination report (FER) for Design No. <span className="font-extrabold text-black font-sans">{ferAppNo || "________________"}</span>
                              </div>

                              {/* Salutation */}
                              <div className="font-bold text-[9.5px] pt-0.5 text-left">
                                Respected Sir,
                              </div>

                              {/* Intro Reference */}
                              <p className="text-justify text-[9px] leading-relaxed font-medium">
                                With reference to the FER received against Design No <span className="font-bold">{ferAppNo || "________"} {ferSuffix}</span> dated {formatDateSuffix(ferIssueDate)} and the telephonic conversation with officials of the Honorable Controller of Design, I am hereby responding to the objections raised in the FER, which are as follows:
                              </p>
                            </>
                          )}

                          {/* Centered Document Header */}
                          {!page.showHeader && (
                            <div className="text-center border-b border-slate-200 pb-1.5 mb-2">
                              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                                Reply to First Examination Report (FER)
                              </h4>
                            </div>
                          )}

                          {/* Tabular Objections Grid */}
                          <div className="pt-1">
                            <table className="w-full border-collapse border border-black text-[8.5px] leading-normal font-serif">
                              <thead>
                                <tr className="bg-slate-50/5 font-bold text-[9px] border-b border-black">
                                  <th className="border border-black px-2 py-1.5 w-10 text-center font-extrabold">Sr. No.</th>
                                  <th className="border border-black px-2.5 py-1.5 w-[45%] text-left font-extrabold">Objection raised by Hon. Patent office</th>
                                  <th className="border border-black px-2.5 py-1.5 text-left font-extrabold">Response to the objections raised by Hon. Patent office</th>
                                </tr>
                              </thead>
                              <tbody className="text-[8.5px] font-medium">
                                {page.objections.map((obj, idx) => {
                                  const startIdx = page.type === "split-p2" ? allPages[0].objections.length : 0;
                                  return (
                                    <tr key={obj.id} className="border-b border-black">
                                      <td className="border border-black px-2 py-1.5 text-center align-top font-bold">{startIdx + idx + 1}</td>
                                      <td className="border border-black px-2.5 py-1.5 text-justify align-top leading-normal">{obj.objection || "—"}</td>
                                      {obj.response ? (
                                        <td className="border border-black px-2.5 py-1.5 text-justify align-top leading-normal">{obj.response}</td>
                                      ) : (
                                        <td className="border border-black px-2.5 py-1.5 text-center align-top font-bold text-slate-400 bg-slate-50/5">—</td>
                                      )}
                                    </tr>
                                  );
                                })}
                                {/* Common Fixed Last Row */}
                                {page.showAttached && (
                                  <tr className="border-b-0">
                                    <td className="border border-black px-2 py-1.5 text-center align-middle font-bold">{ferObjections.length + 1}</td>
                                    <td colSpan={2} className="border border-black px-2.5 py-1.5 text-center align-middle font-bold leading-normal">
                                      Additional Mandatory Documents (Design Registration Sheet) is Attached.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {page.showClosing && (
                            /* Closing Statement */
                            <p className="text-justify text-[9px] leading-relaxed font-medium pt-1">
                              In this regard, kindly find the amended documents uploaded on the web portal of patent office (https://online.ipindia.gov.in/eDesign/) and needful may kindly be done.
                            </p>
                          )}
                        </div>

                        {page.showSignature && (
                          /* Signature Section */
                          <div className="space-y-1 pt-1.5 text-[9px] font-bold leading-tight text-left w-full">
                            <p className="text-left">Thank You,</p>
                            
                            <div className="flex justify-end pt-1">
                              <div className="space-y-1.5 w-fit min-w-[180px] text-left">
                                <p className="text-left font-bold text-[8px] text-black pb-0.5">For,</p>
                                
                                {ferAuthors.map((sig) => (
                                  <div key={sig.id} className="flex items-end justify-start gap-2.5 min-h-[24px]">
                                    <span className="text-[7.5px] font-bold text-black uppercase whitespace-nowrap leading-none pb-0.5">
                                      {sig.name || "________________"}
                                    </span>
                                    {sig.signature ? (
                                      <img src={sig.signature} className="h-6 max-h-7 object-contain mix-blend-multiply pb-0.5" alt="s" />
                                    ) : (
                                      <div className="w-12 h-3" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dedicated printer pages rendering (Only visible during printing) */}
              <div className="hidden print:block w-full">
                {getFERPages().map((page, pIdx, allPages) => (
                  <div key={page.pageNum} className="print-page bg-white text-black font-serif text-[9.5px] leading-relaxed relative flex flex-col justify-between">
                    
                    {/* Legal Correspondence Double-Border frame */}
                    <div className="absolute inset-4 border border-black pointer-events-none">
                      <div className="absolute inset-0.5 border-2 border-black" />
                    </div>

                    <div className="relative z-10 p-4 flex flex-col justify-between h-full space-y-3">
                      <div className="space-y-3">
                        {page.showHeader && (
                          <>
                            {/* Centered Document Header */}
                            <div className="text-center border-b border-slate-200 pb-1.5 mb-2">
                              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                                Reply to First Examination Report (FER)
                              </h4>
                            </div>

                            {/* Top-Right aligned Date */}
                            <div className="text-right font-bold text-[9.5px]">
                              Date: {formatDateIndian(ferDate)}
                            </div>

                            {/* Left address block (Common, Hardcoded) */}
                            <div className="space-y-0.5 text-[9.5px] font-bold leading-tight text-left">
                              <p>To,</p>
                              <p>The Controller of Patent & Designs,</p>
                              <p>The Patent Office,</p>
                              <p>Kolkata</p>
                            </div>

                            {/* Bold Subject Line */}
                            <div className="text-[8.5px] font-bold text-left pt-1 leading-normal tracking-tight uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                              Subject: - Response to First Examination report (FER) for Design No. <span className="font-extrabold text-black font-sans">{ferAppNo || "________________"}</span>
                            </div>

                            {/* Salutation */}
                            <div className="font-bold text-[9.5px] pt-0.5 text-left">
                              Respected Sir,
                            </div>

                            {/* Intro Reference */}
                            <p className="text-justify text-[9px] leading-relaxed font-medium">
                              With reference to the FER received against Design No <span className="font-bold">{ferAppNo || "________"} {ferSuffix}</span> dated {formatDateSuffix(ferIssueDate)} and the telephonic conversation with officials of the Honorable Controller of Design, I am hereby responding to the objections raised in the FER, which are as follows:
                            </p>
                          </>
                        )}

                        {/* Centered Document Header */}
                        {!page.showHeader && (
                          <div className="text-center border-b border-slate-200 pb-1.5 mb-2">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                              Reply to First Examination Report (FER)
                            </h4>
                          </div>
                        )}

                        {/* Tabular Objections Grid */}
                        <div className="pt-1">
                          <table className="w-full border-collapse border border-black text-[8.5px] leading-normal font-serif">
                            <thead>
                              <tr className="bg-slate-50/5 font-bold text-[9px] border-b border-black">
                                <th className="border border-black px-2 py-1.5 w-10 text-center font-extrabold">Sr. No.</th>
                                <th className="border border-black px-2.5 py-1.5 w-[45%] text-left font-extrabold">Objection raised by Hon. Patent office</th>
                                <th className="border border-black px-2.5 py-1.5 text-left font-extrabold">Response to the objections raised by Hon. Patent office</th>
                              </tr>
                            </thead>
                            <tbody className="text-[8.5px] font-medium">
                              {page.objections.map((obj, idx) => {
                                const startIdx = page.type === "split-p2" ? allPages[0].objections.length : 0;
                                return (
                                  <tr key={obj.id} className="border-b border-black">
                                    <td className="border border-black px-2 py-1.5 text-center align-top font-bold">{startIdx + idx + 1}</td>
                                    <td className="border border-black px-2.5 py-1.5 text-justify align-top leading-normal">{obj.objection || "—"}</td>
                                    {obj.response ? (
                                      <td className="border border-black px-2.5 py-1.5 text-justify align-top leading-normal">{obj.response}</td>
                                    ) : (
                                      <td className="border border-black px-2.5 py-1.5 text-center align-top font-bold text-slate-400 bg-slate-50/5">—</td>
                                    )}
                                  </tr>
                                );
                              })}
                              {/* Common Fixed Last Row */}
                              {page.showAttached && (
                                <tr className="border-b-0">
                                  <td className="border border-black px-2 py-1.5 text-center align-middle font-bold">{ferObjections.length + 1}</td>
                                  <td colSpan={2} className="border border-black px-2.5 py-1.5 text-center align-middle font-bold leading-normal">
                                    Additional Mandatory Documents (Design Registration Sheet) is Attached.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {page.showClosing && (
                          /* Closing Statement */
                          <p className="text-justify text-[9px] leading-relaxed font-medium pt-1">
                            In this regard, kindly find the amended documents uploaded on the web portal of patent office (https://online.ipindia.gov.in/eDesign/) and needful may kindly be done.
                          </p>
                        )}
                      </div>

                      {page.showSignature && (
                        /* Signature Section */
                        <div className="space-y-1 pt-1.5 text-[9px] font-bold leading-tight text-left w-full font-serif">
                          <p className="text-left font-bold text-[9px]">Thank You,</p>
                          
                          <div className="flex justify-end pt-1">
                            <div className="space-y-1.5 w-fit min-w-[180px] text-left">
                              <p className="text-left font-bold text-[8px] text-black pb-0.5">For,</p>
                              
                              {ferAuthors.map((sig) => (
                                <div key={sig.id} className="flex items-end justify-start gap-2.5 min-h-[24px]">
                                  <span className="text-[7.5px] font-bold text-black uppercase whitespace-nowrap leading-none pb-0.5">
                                    {sig.name || "________________"}
                                  </span>
                                  {sig.signature ? (
                                    <img src={sig.signature} className="h-6 max-h-7 object-contain mix-blend-multiply pb-0.5" alt="s" />
                                  ) : (
                                    <div className="w-12 h-3" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Checkout Payment Modal Overlay */}
      {isFinalized && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 no-print animate-in fade-in duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden relative"
          >
            {/* Modal Header — vibrant gradient */}
            <div className="relative text-white p-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #db2777)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3" />
              {/* close X */}
              <button
                onClick={() => setIsFinalized(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                  <CreditCard className="w-3 h-3" /> Secure Checkout
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase">Your Order Summary</h3>
                <p className="text-white/70 text-[11px] font-medium leading-relaxed">
                  Review your selected documents and complete payment via Razorpay.
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Order breakdown */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">Document Suite Summary</span>
                <div className="space-y-2.5 font-sans">
                  {selectedPackages.representation && selectedPackages.disclosure ? (
                    <div className="flex justify-between items-center p-3.5 bg-blue-50/20 border border-blue-100 rounded-2xl">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-[11px] text-slate-800">Representation + Disclosure Form</p>
                        <p className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider">Combo Offer Savings Applied</p>
                      </div>
                      <p className="font-black text-xs text-slate-900">₹249</p>
                    </div>
                  ) : (
                    <>
                      {selectedPackages.representation && (
                        <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <p className="font-extrabold text-[11px] text-slate-800">Representation Sheet (Solo)</p>
                          <p className="font-black text-xs text-slate-900">₹149</p>
                        </div>
                      )}
                      {selectedPackages.disclosure && (
                        <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <p className="font-extrabold text-[11px] text-slate-800">Design Disclosure Form (Solo)</p>
                          <p className="font-black text-xs text-slate-900">₹149</p>
                        </div>
                      )}
                    </>
                  )}
                  {selectedPackages.fer && (
                    <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="font-extrabold text-[11px] text-slate-800 font-sans">Reply to FER Objections</p>
                      <p className="font-black text-xs text-slate-900 font-sans">₹49</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Box */}
              <div className="flex justify-between items-center pt-5 border-t border-slate-100">
                <span className="font-extrabold text-sm text-slate-800 font-sans">Grand Total</span>
                <span className="font-black text-2xl text-slate-900 font-sans font-black">₹{calculatePrice()}</span>
              </div>

              {/* Auth Check & Pay action */}
              {!session ? (
                <div className="space-y-4 bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center font-sans">
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed font-sans">
                    Authentication is required to bind this draft suite securely to your account.
                  </p>
                  <Button
                    onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300"
                  >
                    Sign In to Proceed
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 font-sans">
                  <Button
                    onClick={handlePayment}
                    disabled={paymentProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all"
                  >
                    {paymentProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" /> Pay & Unlock with Razorpay
                      </>
                    )}
                  </Button>
                  <p className="text-[8.5px] font-medium text-slate-400 text-center leading-normal">
                    Secure checkout. High security 256-bit encryption by Razorpay.
                  </p>
                </div>
              )}

              {/* Cancel Button */}
              <button
                onClick={() => setIsFinalized(false)}
                disabled={paymentProcessing}
                className="w-full text-center text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-wider pt-2 block transition-colors font-sans"
              >
                Go Back to Editor
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
