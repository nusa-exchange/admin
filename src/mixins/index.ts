import { json2csvAsync } from "json-2-csv";
import { saveAs } from "file-saver";
import { notification } from "@/plugins/antd/custom";
import { TradeController } from "@/controllers";

const fixTime = (time: number) => ("00" + time).slice(-2);

const checkDate = (time: string | number | Date) => {
  const date = new Date(time);
  return date.getFullYear() === 1970
    ? new Date(date.getTime() * 1000)
    : new Date(time);
};

export const getDate = (time: string | number | Date, show_year = false) => {
  const date = checkDate(time);

  const Year = show_year ? date.getFullYear() + "-" : "";
  const Months = fixTime(date.getMonth() + 1);
  const Dates = fixTime(date.getDate());
  const Hours = fixTime(date.getHours());
  const Minutes = fixTime(date.getMinutes());
  const Seconds = fixTime(date.getSeconds());

  return `${Year}${Months}-${Dates} ${Hours}:${Minutes}:${Seconds}`;
}


export const jsonToCSV = async (json: object[]) => {
  const csv = await json2csvAsync(json);

  return csv;
};

export const saveFile = (string: string, filename: string, options?: BlobPropertyBag | undefined) => {
  const blob = new Blob([string], options);

  return saveAs(blob, filename);
};

export const runNotice = (type: ZTypes.NoticeType | "t-success" | "t-info" | "t-warning" | "t-error", message: string) => {
  if (!message) return;

  notification[type.replace("t-", "")]({ message, placement: "topRight" });
};

export const getFileBase64 = (file: File): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const isValidUrl = (string: string) => {
  try {
    new URL(string);
  } catch (error) {
    return false;
  }

  return true;
}

export const getTxIDUrl = (blockchain_key: string, txid: string) => {
  return TradeController.blockchains
    .find(b => b.key == blockchain_key)
    ?.explorer_transaction?.replace("#{txid}", txid);
};

export const getAddressUrl = (blockchain_key: string, txid: string) => {
  return TradeController.blockchains
    .find(b => b.key == blockchain_key)
    ?.explorer_address?.replace("#{address}", txid);
};
