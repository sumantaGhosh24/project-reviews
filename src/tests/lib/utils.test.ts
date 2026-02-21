import {
  cn,
  convertFileToUrl,
  isBase64Image,
  checkStatus,
  checkVisibility,
} from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges tailwind classes correctly", () => {
      expect(cn("px-2", "py-2")).toBe("px-2 py-2");
      expect(cn("px-2", "px-4")).toBe("px-4");
      expect(cn("px-2", undefined, "py-2")).toBe("px-2 py-2");
    });
  });

  describe("convertFileToUrl", () => {
    it("converts a file to a URL", () => {
      const file = new File([""], "test.png", {type: "image/png"});
      const mockCreateObjectURL = jest.fn().mockReturnValue("blob:url");
      global.URL.createObjectURL = mockCreateObjectURL;

      expect(convertFileToUrl(file)).toBe("blob:url");
      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    });
  });

  describe("isBase64Image", () => {
    it("identifies base64 images correctly", () => {
      expect(isBase64Image("data:image/png;base64,abc")).toBe(true);
      expect(isBase64Image("data:image/jpeg;base64,abc")).toBe(true);
      expect(isBase64Image("data:image/webp;base64,abc")).toBe(true);
      expect(isBase64Image("data:image/gif;base64,abc")).toBe(true);
      expect(isBase64Image("invalid")).toBe(false);
      expect(isBase64Image("data:text/plain;base64,abc")).toBe(false);
    });
  });

  describe("checkStatus", () => {
    it("returns correct variant for each status", () => {
      expect(checkStatus("DRAFT")).toBe("secondary");
      expect(checkStatus("DEVELOPMENT")).toBe("warning");
      expect(checkStatus("PRODUCTION")).toBe("success");
      expect(checkStatus("DEPRECATED")).toBe("destructive");
    });

    it("returns default for unknown status", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(checkStatus("UNKNOWN" as any)).toBe("default");
    });
  });

  describe("checkVisibility", () => {
    it("returns correct variant for each visibility", () => {
      expect(checkVisibility("PRIVATE")).toBe("secondary");
      expect(checkVisibility("PUBLIC")).toBe("success");
      expect(checkVisibility("UNLISTED")).toBe("destructive");
    });

    it("returns default for unknown visibility", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(checkVisibility("UNKNOWN" as any)).toBe("default");
    });
  });
});
