import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Trash2 } from "lucide-react"

const documents = [
  {
    id: 1,
    name: "Manual do Produto.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "2024-01-20",
  },
  {
    id: 2,
    name: "FAQ.docx",
    type: "DOCX",
    size: "521 KB",
    uploadedAt: "2024-01-19",
  },
  {
    id: 3,
    name: "Política de Privacidade.pdf",
    type: "PDF",
    size: "890 KB",
    uploadedAt: "2024-01-18",
  },
  {
    id: 4,
    name: "Termos de Uso.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadedAt: "2024-01-17",
  },
]

export function RecentDocuments() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Documentos Recentes</h2>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Data de Upload</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{doc.uploadedAt}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
