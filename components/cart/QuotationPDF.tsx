import React, { useMemo } from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Define professional styles for the quotation
// ... (rest of styles remain unchanged)

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 20,
  },
  companyInfo: {
    width: "50%",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 10,
    color: "#64748b",
    lineHeight: 1.5,
  },
  quoteInfo: {
    width: "40%",
    alignItems: "flex-end",
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
  },
  quoteDetails: {
    fontSize: 10,
    color: "#64748b",
    lineHeight: 1.5,
    textAlign: "right",
  },
  table: {
    width: "100%",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#334155",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableCell: {
    fontSize: 10,
    color: "#0f172a",
  },
  colSku: { width: "15%" },
  colDesc: { width: "45%" },
  colQty: { width: "10%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "15%", textAlign: "right" },
  summary: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  summaryBox: {
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 10,
    color: "#0f172a",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
});

interface QuotationPDFProps {
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  quotationId?: string;
}

export const QuotationPDF = ({ items, subtotal, discount, total, quotationId }: QuotationPDFProps) => {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  // Validity 30 days from now
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const quoteRef = useMemo(() => {
    return quotationId ? `KVX-QT-${quotationId}` : `KVX-QT-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [quotationId]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>KALVEX LABS</Text>
            <Text style={styles.companyDetails}>Institutional Equipment & Services</Text>
            <Text style={styles.companyDetails}>kalvextechnologies@gmail.com</Text>
            <Text style={styles.companyDetails}>www.kalvex.in</Text>
          </View>
          <View style={styles.quoteInfo}>
            <Text style={styles.quoteTitle}>OFFICIAL QUOTATION</Text>
            <Text style={styles.quoteDetails}>Date: {date}</Text>
            <Text style={styles.quoteDetails}>Valid Until: {validUntil}</Text>
            <Text style={styles.quoteDetails}>Ref: {quoteRef}</Text>
          </View>
        </View>

        {/* Introduction */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 10, color: "#334155", lineHeight: 1.5 }}>
            Thank you for considering Kalvex Labs for your institutional requirements. 
            Please find below the detailed quotation for the requested items.
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colSku]}>SKU</Text>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>QTY</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>UNIT PRICE</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>TOTAL</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colSku]}>{item.sku || "N/A"}</Text>
              <View style={styles.colDesc}>
                <Text style={[styles.tableCell, { fontWeight: "bold", marginBottom: 2 }]}>{item.name}</Text>
                {item.project && <Text style={{ fontSize: 8, color: "#64748b" }}>Project: {item.project}</Text>}
              </View>
              <Text style={[styles.tableCell, styles.colQty]}>{item.qty || 1}</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>INR {item.price.toLocaleString()}</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>
                INR {(item.price * (item.qty || 1)).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.summary}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Base Assessment:</Text>
              <Text style={styles.summaryValue}>INR {subtotal.toLocaleString()}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Research Grant Discount:</Text>
                <Text style={styles.summaryValue}>- INR {discount.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL LIABILITY:</Text>
              <Text style={styles.totalValue}>INR {total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Terms & Footer */}
        <View style={{ marginTop: 40 }}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: "#0f172a", marginBottom: 4 }}>Terms & Conditions</Text>
          <Text style={{ fontSize: 8, color: "#64748b", lineHeight: 1.5 }}>
            1. This quotation is valid for 30 days from the date of issuance.{"\n"}
            2. Payment terms: 100% advance along with Purchase Order (PO).{"\n"}
            3. Delivery: Estimated 3-5 business days upon PO and payment confirmation.{"\n"}
            4. Warranty: As per standard manufacturer policies.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>This is a computer generated quotation and does not require a physical signature.</Text>
          <Text>Kalvex Technologies Pvt Ltd | Protected by AES-256 Protocol</Text>
        </View>
      </Page>
    </Document>
  );
};
