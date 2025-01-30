import { useState } from "react"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function UploadDocument() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    await handleUpload(files)
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await handleUpload(files)
  }

  const handleUpload = async (files: File[]) => {
    setIsUploading(true)
    setProgress(0)

    try {
      // Simular upload com progresso
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // TODO: Implementar upload real para o backend
      toast({
        title: "Upload concluído",
        description: `${files.length} arquivo(s) enviado(s) com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar os arquivos.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload de Documentos</DialogTitle>
          <DialogDescription>
            Arraste seus arquivos ou clique para selecionar
          </DialogDescription>
        </DialogHeader>
        <div
          className="mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileInput}
          />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            PDF, DOCX, TXT até 10MB
          </p>
        </div>
        {isUploading && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Processando arquivo...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
