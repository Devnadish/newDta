import Text from "@/components/Text";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from 'next-intl';

const PrioritySelector = ({ 
    priority, 
    setPriority 
}: { 
    priority: number; 
    setPriority: (priority: number) => void; 
}) => {
    const t = useTranslations("addFaq");
    const locale = useLocale();
    const fontFamily = locale === 'ar' ? 'tajawalLight' : 'Geist';

    const getPriorityColor = (level: number) => {
        switch(level) {
            case 1: return 'bg-red-500  hover:bg-red-400';
            case 2: return 'bg-orange-500 hover:bg-orange-400';
            case 3: return 'bg-yellow-500 hover:bg-yellow-400';
            case 4: return 'bg-blue-500 hover:bg-blue-400';
            case 5: return 'bg-green-500 hover:bg-green-400';
            default: return '';
        }
    };

    return (
        <div className="mt-4">
            <Text variant="h4" locale={locale} className="block text-sm font-medium mb-2">{t("priorityLevel")}</Text>
            <RadioGroup
                value={priority.toString()}
                onValueChange={(value) => setPriority(parseInt(value))}
                className="flex gap-4 flex-wrap items-center justify-center font-m"
            >
                {[5, 4, 3, 2, 1].map((level) => (
                    <div 
                        key={level} 
                        className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${getPriorityColor(level)} ${priority === level ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    >
                        <RadioGroupItem value={level.toString()} id={`priority-${level}`} />
                        <Label htmlFor={`priority-${level}`} className={`text-xs font-${fontFamily} text-white`}>
                              {t(`priorityLevel${level}`)}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            
            {/* Priority Information */}
            <div className={`mt-4 p-4 rounded-lg transition-all ${getPriorityColor(priority)} text-white`}>
                <Text variant="p" locale={locale} className={`text-xs font-${fontFamily}`}>
                    {t(`priorityHint${priority}`)}
                </Text>
                <Text variant="p" locale={locale} className={`text-sm font-${fontFamily} mt-2`}>
                    {t('priorityHint6')}
                </Text>
            </div>
        </div>
    );
};

export default PrioritySelector;