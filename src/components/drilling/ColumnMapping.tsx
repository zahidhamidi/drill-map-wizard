import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { DrillingData } from "./DrillingInterface";
import { ChannelBankItem } from "./ChannelBank";

type ColumnMappingProps = {
  data: DrillingData;
  channelBank: ChannelBankItem[];
  onMappingComplete: (mappings: Array<{
    original: string;
    mapped: string;
    originalUnit: string;
    mappedUnit: string;
  }>) => void;
};

// Mock channel bank dictionary
const channelBank = {
  "DEPTH": { standardName: "DEPT", unit: "ft" },
  "GAMMA_RAY": { standardName: "GR", unit: "API" },
  "GAMMA": { standardName: "GR", unit: "API" },
  "RESISTIVITY": { standardName: "RES", unit: "ohm.m" },
  "POROSITY": { standardName: "PORO", unit: "fraction" },
  "TIMESTAMP": { standardName: "TIME", unit: "datetime" },
  "TIME": { standardName: "TIME", unit: "datetime" },
  "DENSITY": { standardName: "RHOB", unit: "g/cm3" },
  "NEUTRON": { standardName: "NPHI", unit: "fraction" },
};

export const ColumnMapping = ({ data, channelBank, onMappingComplete }: ColumnMappingProps) => {
  const [mappings, setMappings] = useState(() => {
    return data.headers.map((header, index) => {
      const headerLower = header.toLowerCase().trim();
      
      // Find matching channel from bank
      const matchedChannel = channelBank.find(channel =>
        channel.aliases.some(alias => alias.toLowerCase() === headerLower)
      );
      
      return {
        original: header,
        mapped: matchedChannel ? matchedChannel.standardName : '',
        originalUnit: data.units[index] || '',
        mappedUnit: matchedChannel ? data.units[index] || '' : ''
      };
    });
  });

  const [searchTerm, setSearchTerm] = useState("");

  const updateMapping = (index: number, field: 'mapped' | 'mappedUnit', value: string) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
  };

  const handleComplete = () => {
    onMappingComplete(mappings);
  };

  const standardChannels = [...new Set(channelBank.map(channel => channel.standardName))];
  const standardUnits = ["ft", "m", "API", "ohm.m", "fraction", "g/cm3", "datetime", "sec"];

  const filteredChannels = standardChannels.filter(channel => 
    channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Column Mapping Configuration
        </h2>
        <p className="text-muted-foreground">
          Map your channel headers to standardized drilling platform names
        </p>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="bg-table-header text-white p-4">
          <div className="grid grid-cols-4 gap-4 font-medium">
            <div>Original Header</div>
            <div>Mapped Channel</div>
            <div>Original Unit</div>
            <div>Mapped Unit</div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {mappings.map((mapping, index) => (
            <div 
              key={index} 
              className={`p-4 grid grid-cols-4 gap-4 items-center ${
                index % 2 === 0 ? 'bg-background' : 'bg-table-row-even'
              } hover:bg-table-row-hover transition-colors`}
            >
              <div className="font-medium text-foreground">
                {mapping.original}
              </div>
              
              <div className="relative">
                <select
                  value={mapping.mapped}
                  onChange={(e) => updateMapping(index, 'mapped', e.target.value)}
                  className="w-full p-2 border border-border rounded bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select channel...</option>
                  {standardChannels.map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </div>
              
              <div className="text-muted-foreground">
                {mapping.originalUnit || "N/A"}
              </div>
              
              <div>
                <select
                  value={mapping.mappedUnit}
                  onChange={(e) => updateMapping(index, 'mappedUnit', e.target.value)}
                  className="w-full p-2 border border-border rounded bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select unit...</option>
                  {standardUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-3">Channel Bank Dictionary</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {channelBank.map((channel) => (
              <div key={channel.id} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-primary">{channel.standardName}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {channel.aliases.map((alias, aliasIndex) => (
                    <span
                      key={aliasIndex}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-3">Mapping Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Columns:</span>
              <span className="font-medium">{mappings.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mapped:</span>
              <span className="font-medium text-success">
                {mappings.filter(m => m.mapped).length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Unmapped:</span>
              <span className="font-medium text-warning">
                {mappings.filter(m => !m.mapped).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {mappings.some(m => !m.mapped) && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <h4 className="font-medium text-warning mb-2">Unmapped Columns Detected</h4>
          <p className="text-sm text-warning">
            {mappings.filter(m => !m.mapped).length} columns are not mapped to standard channels. 
            These will be excluded from the final export unless mapped.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleComplete}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover flex items-center space-x-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Complete Mapping</span>
        </button>
      </div>
    </div>
  );
};