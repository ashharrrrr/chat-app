import { NextResponse } from "next/server";

export function unauthorized() {
  return NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 },
  );
}

export function forbidden() {
  return NextResponse.json(
    { message: "Forbidden" },
    { status: 403 },
  );
}

export function internalServerError() {
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 },
  );
}

export function notFound(message = "Not found") {
  return NextResponse.json(
    { message },
    { status: 404 },
  );
}

export function badRequest(message: string) {
  return NextResponse.json(
    { message },
    { status: 400 },
  );
}
