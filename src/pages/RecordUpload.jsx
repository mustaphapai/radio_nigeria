import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Music, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

const RecordUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const fileInputRef = useRef(null);
    const [programTitle, setProgramTitle] = useState('');

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
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            setSelectedFile(file);
            if (audioRef.current) {
                audioRef.current.src = URL.createObjectURL(file);
            }
        } else {
            toast.error('Please upload an audio file');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('audio/')) {
            setSelectedFile(file);
            if (audioRef.current) {
                audioRef.current.src = URL.createObjectURL(file);
            }
        } else if (file) {
            toast.error('Please upload an audio file');
        }
    };

    const handlePlayPause = () => {
        if (!selectedFile || !audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => {
                console.error("Audio playback error:", error);
                toast.error("Error playing audio");
            });
        }

        setIsPlaying(!isPlaying);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Please upload an audio file');
            return;
        }

        if (!programTitle.trim()) {
            toast.error('Please enter a program title');
            return;
        }

        toast.success('Program submitted successfully!');

        setSelectedFile(null);
        setProgramTitle('');
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Card className="w-[280px] bg-white border-2 shadow-lg mx-auto my-8">
            <CardHeader className="space-y-1 pb-3">
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                    <Upload className="w-4 h-4" />
                    <div>
                        <h2 className="text-sm font-bold truncate">Upload Program</h2>
                        <p className="text-xs font-normal text-gray-500 truncate">
                            Add your radio program recordings here
                        </p>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <label htmlFor="program-title" className="text-xs font-medium text-gray-700">
                            Program Title
                        </label>
                        <input
                            id="program-title"
                            type="text"
                            value={programTitle}
                            onChange={(e) => setProgramTitle(e.target.value)}
                            placeholder="Enter title"
                            className="w-full p-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">
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
                                className="flex items-center justify-center gap-1 p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <Music className="w-3 h-3 text-indigo-500" />
                                <span className="text-xs text-gray-500 truncate">
                                    {selectedFile ? selectedFile.name : "Choose audio file"}
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
                                className="w-full gap-1 text-xs"
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

                            <audio ref={audioRef} controls className="hidden" />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full gap-1 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-xs"
                    >
                        <Upload className="w-3 h-3" />
                        <span>Submit</span>
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default RecordUpload;
