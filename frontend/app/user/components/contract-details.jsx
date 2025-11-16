import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const contracts = [
  { id: "CT001", buyer: "FarmCo Ltd", duration: "3 months", status: "Active" },
  { id: "CT002", buyer: "GreenGrocer Inc", duration: "6 months", status: "Completed" },
  { id: "CT003", buyer: "Organic Farms", duration: "12 months", status: "Pending" },
]

export default function ContractDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Details</CardTitle>
        <CardDescription>View and manage your contracts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.id}</TableCell>
                <TableCell>{contract.buyer}</TableCell>
                <TableCell>{contract.duration}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      contract.status === "Active"
                        ? "default"
                        : contract.status === "Completed"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {contract.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

