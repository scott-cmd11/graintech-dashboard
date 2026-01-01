import { GrainAdoptionTimeline } from '../index';
import { adoptionEvents, grainSolutions } from '../../data';

export function TimelineTab() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <GrainAdoptionTimeline adoptionEvents={adoptionEvents} grainSolutions={grainSolutions} />
        </div>
    );
}
