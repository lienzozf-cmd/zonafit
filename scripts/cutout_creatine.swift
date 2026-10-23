import Cocoa
import Vision
import CoreImage

let inputPath = "public/assets/images/marcas/raw/Creatine Monohydrate  Premium (30 Servings).webp"
let outputPath = "public/assets/images/marcas/raw/creatine_cutout.png"

guard let image = NSImage(contentsOfFile: inputPath),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("Failed to load image")
    exit(1)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try handler.perform([request])

guard let result = request.results?.first else {
    print("No result from vision")
    exit(1)
}

let maskPixelBuffer = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler)

let ciInput = CIImage(cgImage: cgImage)
let ciMask = CIImage(cvPixelBuffer: maskPixelBuffer)

// Blend: foreground = ciInput, background = clear, mask = ciMask
let filter = CIFilter(name: "CIBlendWithMask")!
filter.setValue(ciInput, forKey: kCIInputImageKey)
filter.setValue(CIImage.empty(), forKey: kCIInputBackgroundImageKey)
filter.setValue(ciMask, forKey: kCIInputMaskImageKey)

guard let outputCI = filter.outputImage else {
    print("Filter failed")
    exit(1)
}

let context = CIContext(options: nil)
guard let outputCG = context.createCGImage(outputCI, from: outputCI.extent) else {
    print("Failed to create output CGImage")
    exit(1)
}

let bitmapRep = NSBitmapImageRep(cgImage: outputCG)
guard let pngData = bitmapRep.representation(using: .png, properties: [:]) else {
    print("Failed to get PNG data")
    exit(1)
}

try pngData.write(to: URL(fileURLWithPath: outputPath))
print("Successfully wrote cutout to", outputPath)
