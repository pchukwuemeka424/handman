"use client"; // Ensure this runs only on the client side
import { useEffect } from "react";

export default function TawkToScript() {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById("tawk-script")) return;

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = "https://embed.tawk.to/67d04a2f4af6cc190be79b88/1im2q3i7e";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);

  return null; // This component does not render anything visible
}
