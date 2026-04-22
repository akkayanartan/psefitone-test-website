"use client";

import Script from "next/script";

const WIDGET_TOKEN = "302210be46bd042f37f2470182c121ba0eb88503459373f56cdc0852c947abd9";
const MERCHANT_ID = "694827";

interface Props {
  amountTl: number;
  maxInstallment?: number;
}

export default function PayTRInstallmentWidget({ amountTl, maxInstallment = 5 }: Props) {
  const src = `https://www.paytr.com/odeme/taksit-tablosu/v2?token=${WIDGET_TOKEN}&merchant_id=${MERCHANT_ID}&amount=${amountTl}&taksit=${maxInstallment}&tumu=0`;

  return (
    <div className="mt-10">
      <h2
        className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Taksit Seçenekleri
      </h2>

      <style>{`
        #paytr_taksit_tablosu{clear:both;font-size:12px;max-width:100%;text-align:center;font-family:Arial,sans-serif;}
        #paytr_taksit_tablosu::before{display:table;content:" ";}
        #paytr_taksit_tablosu::after{content:"";clear:both;display:table;}
        .taksit-tablosu-wrapper{margin:5px;width:280px;padding:12px;cursor:default;text-align:center;display:inline-block;border:1px solid #e1e1e1;}
        .taksit-logo img{max-height:28px;padding-bottom:10px;}
        .taksit-tutari-text{float:left;width:126px;color:#a2a2a2;margin-bottom:5px;}
        .taksit-tutar-wrapper{display:inline-block;background-color:#f7f7f7;}
        .taksit-tutar-wrapper:hover{background-color:#e8e8e8;}
        .taksit-tutari{float:left;width:126px;padding:6px 0;color:#474747;border:2px solid #ffffff;}
        .taksit-tutari-bold{font-weight:bold;}
        @media all and (max-width:600px){.taksit-tablosu-wrapper{margin:5px 0;}}
      `}</style>

      <div id="paytr_taksit_tablosu" />
      <Script src={src} strategy="afterInteractive" />
    </div>
  );
}
