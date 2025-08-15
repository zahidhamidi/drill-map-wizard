import { useState, useEffect } from "react";
import { Search, Plus, Edit3, Trash2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type ChannelBankItem = {
  id: string;
  standardName: string;
  aliases: string[];
};

type ChannelBankProps = {
  onChannelBankUpdate?: (channels: ChannelBankItem[]) => void;
};

const defaultChannels: ChannelBankItem[] = [
  {
    id: '1',
    standardName: 'WOB',
    aliases: ['wob', 'weight on bit', 'bit weight', 'weight_on_bit']
  },
  {
    id: '2',
    standardName: 'RPM',
    aliases: ['rpm', 'rotary speed', 'rotation speed', 'rotary_speed']
  },
  {
    id: '3',
    standardName: 'DEPTH',
    aliases: ['depth', 'measured depth', 'md', 'measured_depth']
  },
  {
    id: '4',
    standardName: 'HOOKLOAD',
    aliases: ['hookload', 'hook load', 'hook_load', 'hkld']
  },
  {
    id: '5',
    standardName: 'TORQUE',
    aliases: ['torque', 'tor', 'surface torque', 'surf_torque']
  }
];

export const ChannelBank = ({ onChannelBankUpdate }: ChannelBankProps) => {
  const [channels, setChannels] = useState<ChannelBankItem[]>(defaultChannels);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ standardName: '', aliases: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    onChannelBankUpdate?.(channels);
  }, [channels, onChannelBankUpdate]);

  const filteredChannels = channels.filter(channel =>
    channel.standardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (channel: ChannelBankItem) => {
    setEditingId(channel.id);
    setEditForm({
      standardName: channel.standardName,
      aliases: channel.aliases.join(', ')
    });
  };

  const handleSave = (id: string) => {
    const aliases = editForm.aliases
      .split(',')
      .map(alias => alias.trim())
      .filter(alias => alias.length > 0);

    setChannels(prev => prev.map(channel =>
      channel.id === id
        ? { ...channel, standardName: editForm.standardName, aliases }
        : channel
    ));
    setEditingId(null);
    setEditForm({ standardName: '', aliases: '' });
  };

  const handleDelete = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
  };

  const handleAddNew = () => {
    if (!editForm.standardName.trim()) return;

    const aliases = editForm.aliases
      .split(',')
      .map(alias => alias.trim())
      .filter(alias => alias.length > 0);

    const newChannel: ChannelBankItem = {
      id: Date.now().toString(),
      standardName: editForm.standardName.trim(),
      aliases
    };

    setChannels(prev => [...prev, newChannel]);
    setIsAddingNew(false);
    setEditForm({ standardName: '', aliases: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setEditForm({ standardName: '', aliases: '' });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Channel Bank Database
        </h2>
        <p className="text-muted-foreground">
          Manage standard channel names and their aliases for automatic matching
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search channels or aliases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Channel
        </Button>
      </div>

      <div className="bg-card border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-table-header text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Standard Channel Name</th>
                <th className="px-4 py-3 text-left font-medium">Aliases</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isAddingNew && (
                <tr className="bg-primary/5">
                  <td className="px-4 py-3">
                    <Input
                      placeholder="Standard channel name"
                      value={editForm.standardName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, standardName: e.target.value }))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      placeholder="Aliases (comma separated)"
                      value={editForm.aliases}
                      onChange={(e) => setEditForm(prev => ({ ...prev, aliases: e.target.value }))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleAddNew}
                        className="flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
              {filteredChannels.map((channel, index) => (
                <tr 
                  key={channel.id}
                  className={`${
                    index % 2 === 0 ? 'bg-background' : 'bg-table-row-even'
                  } hover:bg-table-row-hover transition-colors`}
                >
                  <td className="px-4 py-3">
                    {editingId === channel.id ? (
                      <Input
                        value={editForm.standardName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, standardName: e.target.value }))}
                      />
                    ) : (
                      <span className="font-medium text-primary">{channel.standardName}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === channel.id ? (
                      <Input
                        value={editForm.aliases}
                        onChange={(e) => setEditForm(prev => ({ ...prev, aliases: e.target.value }))}
                      />
                    ) : (
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
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      {editingId === channel.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSave(channel.id)}
                            className="flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(channel)}
                            className="flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(channel.id)}
                            className="flex items-center gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredChannels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No channels found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};