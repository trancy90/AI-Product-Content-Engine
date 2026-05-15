import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { Scene } from "@/types/storyboard";

export async function POST(request: Request) {
  const { scenes } = (await request.json()) as { scenes: Scene[] };

  if (!scenes?.length) {
    return NextResponse.json({ error: "No scenes to export." }, { status: 400 });
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(scenes);
  XLSX.utils.book_append_sheet(workbook, worksheet, "storyboard");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="storyboard.xlsx"'
    }
  });
}
