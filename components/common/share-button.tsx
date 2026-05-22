"use client";

import * as React from "react";
import { Share2 } from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function ShareButton({ url, title }: { url: string; title: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="rounded-md overflow-hidden">
          {/* Facebook */}
          <FacebookShareButton url={url} title={title}>
            <button className="flex items-center gap-2 p-2 w-full bg-blue-600 hover:bg-blue-500 transition-all duration-200">
              <FaFacebookF className="text-white text-lg" />
            </button>
          </FacebookShareButton>

          {/* Twitter (X) */}
          <TwitterShareButton url={url} title={title}>
            <button className="flex items-center gap-2 p-2 w-full bg-black hover:bg-black/70 transition-all duration-200">
              <FaXTwitter className="text-white text-lg" />
            </button>
          </TwitterShareButton>

          {/* WhatsApp */}
          <WhatsappShareButton url={url} title={title} separator=" - ">
            <button className="flex items-center gap-2 p-2 w-full bg-green-600 hover:bg-green-500 transition-all duration-200">
              <FaWhatsapp className="text-white text-lg" />
            </button>
          </WhatsappShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
