import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Upload } from "lucide-react"

const documents = [
  { name: "Contract Agreement", type: "PDF", size: "2.3 MB" },
  { name: "Farm Certification", type: "PDF", size: "1.5 MB" },
  { name: "Identity Proof", type: "JPG", size: "3.1 MB" },
]

export default function Documents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Securely store and manage your important files</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.name}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Document
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

