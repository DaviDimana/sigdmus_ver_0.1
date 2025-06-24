import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormFieldInputProps {
  id: string;
  label: string;
  type?: 'text' | 'date' | 'time' | 'time-select' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

const FormFieldInput: React.FC<FormFieldInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleTimeSelectChange = (hours: string, minutes: string) => {
    const timeValue = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    onChange(timeValue);
  };

  // Para time-select, extrair horas e minutos do valor atual
  const getCurrentTime = () => {
    if (!value) return { hours: '00', minutes: '00' };
    const [hours, minutes] = value.split(':');
    return { hours: hours || '00', minutes: minutes || '00' };
  };

  // Gerar opções de horas (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Gerar opções de minutos (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
        />
      ) : type === 'time-select' ? (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor={`${id}-hours`} className="text-xs text-muted-foreground mb-1 block">
              Hora
            </Label>
            <Select
              value={getCurrentTime().hours}
              onValueChange={(hours) => handleTimeSelectChange(hours, getCurrentTime().minutes)}
            >
              <SelectTrigger>
                <SelectValue placeholder="00" />
              </SelectTrigger>
              <SelectContent>
                {hourOptions.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="flex items-center text-gray-500 font-medium text-lg mb-2">:</span>
          <div className="flex-1">
            <Label htmlFor={`${id}-minutes`} className="text-xs text-muted-foreground mb-1 block">
              Minuto
            </Label>
            <Select
              value={getCurrentTime().minutes}
              onValueChange={(minutes) => handleTimeSelectChange(getCurrentTime().hours, minutes)}
            >
              <SelectTrigger>
                <SelectValue placeholder="00" />
              </SelectTrigger>
              <SelectContent>
                {minuteOptions.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormFieldInput;
