import { useState } from "react";
import Button from "../../ui/Button";

interface InstallModProps {
  gameId: number;
  onModInstalled: () => void;
  onCancel: () => void;
}

export default function InstallMod({
  gameId,
  onModInstalled,
  onCancel,
}: InstallModProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modName, setModName] = useState("");
  const [isInstalling, setIsInstalling] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setError("");

    if (file && !modName) {
      const nameWithoutExtension = file.name.replace(/\.(zip|rar|7z)$/i, "");
      setModName(nameWithoutExtension);
    }
  };

  const handleInstall = async () => {
    if (!selectedFile) {
      setError("Please select a file to install");
      return;
    }

    setIsInstalling(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (modName.trim()) {
        formData.append("mod_name", modName.trim());
      }

      const response = await fetch(
        `http://localhost:8000/api/games/${gameId}/mods/install`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Installation failed: ${response.status}`,
        );
      }

      onModInstalled();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsInstalling(false);
    }
  };

  const getSupportedFormats = () => {
    return ".zip,.rar,.7z";
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="header-2 mb-4">Install New Mod</h2>

        <div className="space-y-4">
          {/* File Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Mod File
            </label>
            <input
              type="file"
              accept={getSupportedFormats()}
              onChange={handleFileSelect}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Mod Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mod Name (optional)
            </label>
            <input
              type="text"
              value={modName}
              onChange={(e) => setModName(e.target.value)}
              placeholder="Auto-detected from filename"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="rounded-md bg-gray-50 p-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Selected:</span>{" "}
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onCancel}
              variant="back"
              disabled={isInstalling}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInstall}
              variant="install"
              disabled={!selectedFile || isInstalling}
              className="flex-1"
            >
              {isInstalling ? "Installing..." : "Install Mod"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
