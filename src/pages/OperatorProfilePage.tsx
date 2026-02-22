import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOperatorDetails, updateOperatorDetails } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, User, MapPin, Globe, Wallet, Mail, Phone, CreditCard, FileText, Edit2, Save, X } from "lucide-react";
import WalletCard from "@/components/WalletCard";
import { toast } from "@/hooks/use-toast";

export default function OperatorProfilePage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["operator-details"],
    queryFn: fetchOperatorDetails,
  });

  const updateMutation = useMutation({
    mutationFn: updateOperatorDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator-details"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Operator details updated successfully",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update operator details",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (data) {
      setFormData(data as Record<string, unknown>);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const updateField = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading operator details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load operator details</p>
      </div>
    );
  }

  const op = (isEditing ? formData : data) as Record<string, unknown> | null;
  if (!op) return null;

  const operator = op.operator as Record<string, unknown> | undefined;
  const walletBalance = Number(op.wallet ?? 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Operator Profile</h1>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline" className="gap-2">
            <Edit2 className="w-4 h-4" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
              <Save className="w-4 h-4" /> {updateMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        )}
      </div>

      {/* Logo and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Operator Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {op.logo && !isEditing && (
              <div className="flex justify-center mb-4">
                <img
                  src={String(op.logo)}
                  alt={String(op.operator_name ?? "Operator")}
                  className="h-24 w-24 object-contain rounded-lg border border-border"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Operator Name</p>
                {isEditing ? (
                  <Input
                    value={String(op.operator_name ?? "")}
                    onChange={(e) => updateField("operator_name", e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{String(op.operator_name ?? "—")}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">POC Name</p>
                {isEditing ? (
                  <Input
                    value={String(op.poc_name ?? "")}
                    onChange={(e) => updateField("poc_name", e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{String(op.poc_name ?? "—")}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Designation</p>
                {isEditing ? (
                  <Input
                    value={String(op.designation ?? "")}
                    onChange={(e) => updateField("designation", e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{String(op.designation ?? "—")}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Operator Type</p>
                {isEditing ? (
                  <Input
                    value={String(op.operator_type ?? "")}
                    onChange={(e) => updateField("operator_type", e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{String(op.operator_type ?? "—")}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Country</p>
                {isEditing ? (
                  <Input
                    value={String(op.country ?? "")}
                    onChange={(e) => updateField("country", e.target.value)}
                  />
                ) : (
                  <p className="font-medium">{String(op.country ?? "—")}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Operator Code</p>
                <p className="font-medium">{String(op.operator_unique_code ?? "—")}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Office Address
              </p>
              {isEditing ? (
                <Textarea
                  value={String(op.office_address ?? "")}
                  onChange={(e) => updateField("office_address", e.target.value)}
                  rows={3}
                />
              ) : (
                <p className="font-medium">{String(op.office_address ?? "—")}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Globe className="w-4 h-4" /> Website
              </p>
              {isEditing ? (
                <Input
                  type="url"
                  value={String(op.website ?? "")}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="https://example.com"
                />
              ) : op.website ? (
                <a
                  href={String(op.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {String(op.website)}
                </a>
              ) : (
                <p className="font-medium">—</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WalletCard balance={walletBalance} />
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      {operator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  {isEditing ? (
                    <Input
                      value={operator ? String(operator.email ?? "") : ""}
                      onChange={(e) => {
                        const updatedOperator = operator ? { ...operator, email: e.target.value } : { email: e.target.value };
                        updateField("operator", updatedOperator);
                      }}
                    />
                  ) : (
                    <p className="font-medium">{operator?.email ? String(operator.email) : "—"}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  {isEditing ? (
                    <Input
                      value={operator ? String(operator.phone_number ?? "") : ""}
                      onChange={(e) => {
                        const updatedOperator = operator ? { ...operator, phone_number: e.target.value } : { phone_number: e.target.value };
                        updateField("operator", updatedOperator);
                      }}
                    />
                  ) : (
                    <p className="font-medium">{operator?.phone_number ? String(operator.phone_number) : "—"}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment & Banking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment & Banking Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Beneficiary Name</p>
              {isEditing ? (
                <Input
                  value={String(op.beneficiary_name ?? "")}
                  onChange={(e) => updateField("beneficiary_name", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.beneficiary_name ? String(op.beneficiary_name) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Number</p>
              {isEditing ? (
                <Input
                  value={String(op.beneficiary_account_number ?? "")}
                  onChange={(e) => updateField("beneficiary_account_number", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.beneficiary_account_number ? String(op.beneficiary_account_number) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
              {isEditing ? (
                <Input
                  value={String(op.beneficiary_bank_name ?? "")}
                  onChange={(e) => updateField("beneficiary_bank_name", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.beneficiary_bank_name ? String(op.beneficiary_bank_name) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">IFSC Code</p>
              {isEditing ? (
                <Input
                  value={String(op.ifsc_code ?? "")}
                  onChange={(e) => updateField("ifsc_code", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.ifsc_code ? String(op.ifsc_code) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">UPI ID</p>
              {isEditing ? (
                <Input
                  value={String(op.upi_id ?? "")}
                  onChange={(e) => updateField("upi_id", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.upi_id ? String(op.upi_id) : "—"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents & Registrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents & Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">PAN Card</p>
              {isEditing ? (
                <Input
                  value={String(op.pan_card ?? "")}
                  onChange={(e) => updateField("pan_card", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.pan_card ? String(op.pan_card) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Aadhar Card</p>
              {isEditing ? (
                <Input
                  value={String(op.adhar_card ?? "")}
                  onChange={(e) => updateField("adhar_card", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.adhar_card ? String(op.adhar_card) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">License</p>
              {isEditing ? (
                <Input
                  value={String(op.license ?? "")}
                  onChange={(e) => updateField("license", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.license ? String(op.license) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">GST</p>
              {isEditing ? (
                <Input
                  value={String(op.gst ?? "")}
                  onChange={(e) => updateField("gst", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.gst ? String(op.gst) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">ATOAI Registration</p>
              {isEditing ? (
                <Input
                  value={String(op.atoai_registration ?? "")}
                  onChange={(e) => updateField("atoai_registration", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.atoai_registration ? String(op.atoai_registration) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ministry of Tourism Registration</p>
              {isEditing ? (
                <Input
                  value={String(op.ministry_of_tourism_registration ?? "")}
                  onChange={(e) => updateField("ministry_of_tourism_registration", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.ministry_of_tourism_registration ? String(op.ministry_of_tourism_registration) : "—"}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">State Tourism Registration</p>
              {isEditing ? (
                <Input
                  value={String(op.state_tourism_registration ?? "")}
                  onChange={(e) => updateField("state_tourism_registration", e.target.value)}
                />
              ) : (
                <p className="font-medium">{op.state_tourism_registration ? String(op.state_tourism_registration) : "—"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      {op.onboarded_by_email && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Onboarded By</p>
                <p className="font-medium">{String(op.onboarded_by_email)}</p>
              </div>
              {op.permission && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Permission</p>
                  <p className="font-medium">{String(op.permission)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
