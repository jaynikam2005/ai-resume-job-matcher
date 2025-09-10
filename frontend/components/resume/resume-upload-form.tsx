"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { ResumeService } from "@/lib/services/resume"
import { AuthService } from "@/lib/services/auth"

interface ExtractedInfo {
  name?: string | null
  email?: string | null
  phone?: string | null
  title?: string | null
  summary?: string | null
  experience?: string | null
  skills: string[]
  education: string[]
  ats_score?: number
}

export function ResumeUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  const handleFileSelect = useCallback((selectedFile: File) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or Word document")
      return
    }

    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10MB")
      return
    }

    setFile(selectedFile)
    setError("")
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [handleFileSelect],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const simulateUploadProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      // Visual progress while uploading
      simulateUploadProgress()
      const result = await ResumeService.parseResumeFile(file)
      setIsUploading(false)
      setIsProcessing(false)

      const info: ExtractedInfo = {
        name: result.name ?? null,
        email: result.email ?? null,
        phone: result.phone ?? null,
        title: result.title ?? null,
        summary: result.summary ?? null,
        experience: Array.isArray(result.experience) ? result.experience.join("\n") : result.experience,
        skills: result.skills || [],
        education: result.education || [],
        ats_score: result.ats_score,
      }

      setExtractedInfo(info)
      
      // If we have an email, attempt auto-login
      if (result.email) {
        try {
          const firstName = result.name ? result.name.split(' ')[0] : undefined;
          const lastName = result.name && result.name.split(' ').length > 1 
            ? result.name.split(' ').slice(1).join(' ') 
            : undefined;
            
          await AuthService.resumeLogin({
            email: result.email,
            firstName,
            lastName
          });
          
          // No need to redirect, we'll do that when they click "Find Matching Jobs"
        } catch (loginErr) {
          console.error("Auto-login failed, but resume was processed successfully", loginErr);
          // We don't show an error for this since the resume upload succeeded
        }
      }
    } catch (err) {
      console.error("Resume upload failed", err);
      setError("Upload failed. Please try again.")
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const handleFindJobs = () => {
    router.push("/dashboard")
  }

  const removeFile = () => {
    setFile(null)
    setExtractedInfo(null)
    setUploadProgress(0)
    setError("")
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!extractedInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>Supported formats: PDF, DOC, DOCX (Max 10MB)</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!file ? (
              <button
                type="button"
                className="w-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Drop your resume here</h3>
                <p className="text-muted-foreground mb-4">or click to browse files</p>
                <Button variant="outline">Choose File</Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-lg font-medium">AI is analyzing your resume...</p>
                      <p className="text-muted-foreground">This may take a few moments</p>
                    </div>
                  </div>
                )}

                {!isUploading && !isProcessing && (
                  <Button onClick={handleUpload} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Analyze Resume
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Extracted Information */}
      {extractedInfo && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <CardTitle>Resume Analysis Complete</CardTitle>
            </div>
            <CardDescription>Here's what we extracted from your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {extractedInfo.name || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {extractedInfo.email || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {extractedInfo.phone || "-"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Professional Summary</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Title:</span> {extractedInfo.title || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Experience:</span> {extractedInfo.experience || "-"}
                  </p>
                  {extractedInfo.summary && (
                    <p>
                      <span className="font-medium">Summary:</span> {extractedInfo.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-semibold mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {extractedInfo.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h4 className="font-semibold mb-3">Education</h4>
              <div className="space-y-1">
                {extractedInfo.education.map((edu) => (
                  <p key={edu} className="text-sm">
                    {edu}
                  </p>
                ))}
              </div>
            </div>

            {/* ATS Score + Action Button */}
            {typeof extractedInfo.ats_score === "number" && (
              <div>
                <h4 className="font-semibold mb-2">ATS Score</h4>
                <div className="flex items-center gap-3">
                  <Progress value={extractedInfo.ats_score} className="w-2/3" />
                  <span className="text-sm font-medium">{extractedInfo.ats_score}%</span>
                </div>
              </div>
            )}
            <div className="pt-4">
              <Button onClick={handleFindJobs} size="lg" className="w-full">
                Find Matching Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
