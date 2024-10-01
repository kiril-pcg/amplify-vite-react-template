import { useState, useEffect } from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function Industries() {
  return (
    <div>
      
    </div>
  )
}
