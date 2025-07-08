import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  name: string;
  location: string;
  description: string | null;
  created_at: string;
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: ""
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Erro ao carregar propriedades",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingProperty) {
        const { error } = await supabase
          .from("properties")
          .update({
            name: formData.name,
            location: formData.location,
            description: formData.description || null,
          })
          .eq("id", editingProperty.id);

        if (error) throw error;
        toast({
          title: "Propriedade atualizada!",
          description: "A propriedade foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("properties")
          .insert({
            name: formData.name,
            location: formData.location,
            description: formData.description || null,
            user_id: user.id,
          });

        if (error) throw error;
        toast({
          title: "Propriedade criada!",
          description: "A propriedade foi adicionada com sucesso.",
        });
      }

      setDialogOpen(false);
      setEditingProperty(null);
      setFormData({ name: "", location: "", description: "" });
      fetchProperties();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar propriedade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      location: property.location,
      description: property.description || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta propriedade?")) return;

    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId);

      if (error) throw error;
      toast({
        title: "Propriedade excluída!",
        description: "A propriedade foi removida com sucesso.",
      });
      fetchProperties();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir propriedade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Carregando propriedades...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Minhas Propriedades</h1>
            <p className="text-muted-foreground">Gerencie suas propriedades de aluguel</p>
          </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProperty(null);
              setFormData({ name: "", location: "", description: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Propriedade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? "Editar Propriedade" : "Nova Propriedade"}
              </DialogTitle>
              <DialogDescription>
                {editingProperty 
                  ? "Edite os dados da propriedade"
                  : "Adicione uma nova propriedade para gerenciar"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Propriedade</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Rio Marina Resort"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Itacuruçá, RJ"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da propriedade..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProperty ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{property.name}</span>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(property)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{property.location}</CardDescription>
            </CardHeader>
            {property.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{property.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Você ainda não tem propriedades cadastradas.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Propriedade
          </Button>
        </div>
      )}
      </div>
    </Layout>
  );
}