import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Music, Play, Pause } from 'lucide-react';

function Conversion() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [convertedFile, setConvertedFile] = useState(null);
    const [programTitle, setProgramTitle] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            audioRef.current.src = objectUrl;
            return () => URL.revokeObjectURL(objectUrl); // cleanup
        }
    }, [selectedFile]);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
        setIsDragging(false);
    };


    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert("Please select an audio file.");
            return;
        }

        // Convert to MP3 (Placeholder - Implement actual conversion logic)
        try {
            // Simulate conversion
            const convertedBlob = new Blob([await selectedFile.arrayBuffer()], { type: 'audio/mpeg' });
            const convertedFile = new File([convertedBlob], `${programTitle ? programTitle : selectedFile.name.split('.')[0]}.mp3`, { type: 'audio/mpeg' });

            setConvertedFile(convertedFile);
            alert("File converted to MP3!");
        } catch (error) {
            console.error("Conversion error:", error);
            alert("Failed to convert file.");
        }
    };

    const handleDownload = () => {
        if (convertedFile) {
            const url = URL.createObjectURL(convertedFile);
            const link = document.createElement('a');
            link.href = url;
            link.download = convertedFile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-[280px] bg-white border-2 shadow-lg">
                <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="flex items-center gap-2 text-indigo-600 text-sm">
                        <Upload className="w-4 h-4" />
                        <div>
                            <h2 className="text-sm font-bold truncate">Convert to MP3</h2>
                            <p className="text-[0.6rem] font-normal text-gray-500 truncate">
                                Convert your audio files to MP3 format
                            </p>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1">
                            <label htmlFor="program-title" className="text-[0.7rem] font-medium text-gray-700">
                                Program Title
                            </label>
                            <input
                                id="program-title"
                                type="text"
                                value={programTitle}
                                onChange={(e) => setProgramTitle(e.target.value)}
                                placeholder="Enter program title"
                                className="w-full p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[0.7rem]"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[0.7rem] font-medium text-gray-700">
                                Audio File
                            </label>
                            <div
                                className={`relative border-2 ${isDragging ? 'border-indigo-500' : 'border-dashed'} rounded-md transition-colors`}
                                onDragOver={handleDrag}
                                onDragEnter={handleDragIn}
                                onDragLeave={handleDragOut}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="flex items-center justify-center gap-2 p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <Music className="w-3 h-3 text-indigo-500" />
                                    <span className="text-[0.7rem] text-gray-500 truncate">
                                        {selectedFile ? selectedFile.name : "Choose or drop audio file"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {selectedFile && (
                            <div className="space-y-1">
                                <div className="text-[0.6rem] text-gray-500 truncate">
                                    Selected file: {selectedFile.name}
                                </div>

                                <Button
                                    type="button"
                                    onClick={handlePlayPause}
                                    variant="outline"
                                    className="w-full gap-2 text-[0.7rem]"
                                >
                                    {isPlaying ? (
                                        <>
                                            <Pause className="w-3 h-3" />
                                            <span>Pause</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-3 h-3" />
                                            <span>Preview</span>
                                        </>
                                    )}
                                </Button>

                                <audio ref={audioRef}  className="hidden" />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-[0.7rem]"
                        >
                            <Upload className="w-3 h-3" />
                            <span>Convert to MP3</span>
                        </Button>
                    </form>

                    {convertedFile && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-700">Converted File</h3>
                            <audio src={URL.createObjectURL(convertedFile)} controls className="w-full" />
                            <Button onClick={handleDownload} className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white transition-colors text-[0.7rem]">
                                <Upload className="w-3 h-3" />
                                <span>Download Converted File</span>
                            </Button>
                            <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white transition-colors text-[0.7rem]">
                                <Upload className="w-3 h-3" />
                                <span>Submit Program to Studio</span>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Conversion;