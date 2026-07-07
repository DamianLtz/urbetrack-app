import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentInputSchema, type IncidentInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { TYPE_OPTIONS } from "@/lib/incidentOptions";
import { useZones } from "@/hooks/useZones";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateIncident } from "@/hooks/useIncidents";
import { Toast } from "@/components/toast/Toast";
import { toast } from "sonner";
import { PageHeader } from "@/components/pageHeader/PageHeader";

function LocationPicker({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const CABA_CENTER: [number, number] = [-34.6037, -58.3816];

export default function NewIncidentPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateIncident();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IncidentInput>({
    resolver: zodResolver(incidentInputSchema),
    defaultValues: {
      type: undefined,
      zoneId: "",
      description: "",
      lat: undefined,
      lng: undefined,
    },
  });

  const onSubmit = (data: IncidentInput) => {
    mutate(data, {
      onSuccess: () => {
        toast.custom((id) => (
          <Toast id={id} variant="success">
            El incidente ha sido cargado con éxito.
          </Toast>
        ));
        navigate("/incidentes");
      },
      onError: () => {
        toast.custom((id) => (
          <Toast id={id} variant="error">
            Ocurrió un error cargando el incidente.
          </Toast>
        ));
      },
    });
  };

  const lat = watch("lat");
  const lng = watch("lng");
  const {
    data: zones,
    isLoading: zonesLoading,
    isError: zonesError,
  } = useZones();
  const zonesDisabled = zonesLoading || zonesError;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reportar incidente"
        subtitle="Completá los datos y marcá la ubicación en el mapa"
      />

      <Card>
        <section className="px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="mb-4">
                  Completá el formulario para cargar la incidencia
                </FieldLegend>
                <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <div className="grid grid-cols-12 gap-6">
                    <Field
                      className="col-span-12 md:col-span-6 lg:col-span-6"
                      data-invalid={!!errors.type}
                    >
                      <FieldLabel>Tipo</FieldLabel>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              sizeClassName="w-full"
                              aria-invalid={!!errors.type}
                            >
                              <SelectValue placeholder="Seleccioná el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {TYPE_OPTIONS.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.type?.message && (
                        <FieldError>Seleccioná el tipo de incidente</FieldError>
                      )}
                    </Field>
                    <Field
                      className="col-span-12 md:col-span-6 lg:col-span-6"
                      data-invalid={!!errors.zoneId}
                    >
                      <FieldLabel>Zona</FieldLabel>
                      <Controller
                        name="zoneId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            disabled={zonesDisabled}
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              sizeClassName="w-full"
                              disabled={zonesDisabled}
                              aria-invalid={!!errors.zoneId}
                            >
                              <SelectValue
                                placeholder={
                                  zonesLoading
                                    ? "Cargando zonas..."
                                    : "Seleccioná la zona"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {zones?.map((zone) => (
                                  <SelectItem key={zone.id} value={zone.id}>
                                    {zone.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.zoneId?.message && (
                        <FieldError>Seleccioná la zona</FieldError>
                      )}
                    </Field>
                    <Field
                      className="col-span-12"
                      data-invalid={!!errors.description}
                    >
                      <FieldLabel>Descripción</FieldLabel>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            aria-invalid={!!errors.description}
                            className="min-h-24"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      {errors.description?.message && (
                        <FieldError>La descripción es obligatoria</FieldError>
                      )}
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel>Ubicación</FieldLabel>
                    <FieldDescription>
                      Seleccioná en el mapa la ubicación del incidente.
                    </FieldDescription>
                    <Card
                      className={cn(
                        "overflow-hidden p-0",
                        errors.lat &&
                          "border border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
                      )}
                    >
                      <MapContainer
                        center={CABA_CENTER}
                        zoom={12}
                        scrollWheelZoom={false}
                        className="h-80 w-full"
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker
                          onPick={(lat, lng) => {
                            setValue("lat", lat, { shouldValidate: true });
                            setValue("lng", lng, { shouldValidate: true });
                          }}
                        />
                        {lat != null && lng != null && (
                          <Marker position={[lat, lng]} />
                        )}
                      </MapContainer>
                    </Card>
                    {errors.lat ? (
                      <FieldError>Marcá la ubicación en el mapa</FieldError>
                    ) : (
                      <FieldDescription className="tabular-nums">
                        {lat != null && lng != null
                          ? `Ubicación: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
                          : "Ubicación sin seleccionar"}
                      </FieldDescription>
                    )}
                  </Field>
                </FieldGroup>
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full sm:w-auto"
                    onClick={() => navigate("/incidentes")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={isPending}
                    variant="primary"
                    className="w-full sm:w-auto"
                    type="submit"
                  >
                    {isPending ? "Cargando..." : "Cargar"}
                  </Button>
                </div>
              </FieldSet>
            </FieldGroup>
          </form>
        </section>
      </Card>
    </div>
  );
}
