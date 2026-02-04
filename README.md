# FairRoute AI 🚚⚖️

> **Problem Statement CDSC03**: Building a fair dispatch system for delivery drivers that mirrors how a thoughtful human dispatcher would operate.

## 🎯 The Problem

Every day, dispatchers assign delivery routes to drivers. These assignments determine how many packages a driver delivers, how heavy their load is, how difficult their route is, and ultimately how fair their workday feels.

Two drivers doing "the same job" may have very different experiences:
- **Driver A** gets 150 light packages in quiet neighborhoods
- **Driver B** gets 200 heavy packages involving apartments, stairs, and difficult parking
- **Driver C** consistently receives the hardest routes
- **Driver D** gets easier routes but doesn't understand why

## 💡 Our Solution

FairRoute AI is a **fairness-by-design dispatch system** that:

1. **Calculates Effort Scores** - Measures the real difficulty of routes based on:
   - 📦 Package weight
   - 🏢 Stair climbs
   - 🅿️ Parking difficulty
   - 📍 Delivery type (residential, commercial, apartment)

2. **Tracks Fairness with Gini Coefficient** - Uses economic inequality metrics to ensure workload distribution:
   - ✅ `< 0.15` = Fair distribution
   - ⚠️ `0.15 - 0.30` = Moderate imbalance
   - ❌ `> 0.30` = Unfair, action needed

3. **Provides Transparent Explanations** - Every assignment comes with human-readable reasoning:
   > "This route was assigned to Sarah Chen because their cumulative effort today was 18% below the team average, and this route involves heavier packages (18kg) and challenging parking conditions."

4. **Interactive AI Dispatch Simulator** - Watch the AI "think" through assignment decisions in real-time

## 🖥️ Features

### Dashboard
- Real-time summary of drivers, deliveries, and fairness scores
- Effort distribution chart showing workload balance
- Weekly fairness trend tracking

### Driver Workload
- Sortable table of all drivers with effort scores
- Visual workload level indicators (Low/Medium/High)
- Click-to-explain functionality

### AI Dispatch Simulator
- Step-by-step visualization of AI decision making
- Confidence scores for recommendations
- Alternative driver suggestions
- Fairness impact preview before assignment

### Explainable Dispatch
- Detailed breakdowns of why each route was assigned
- Route factors (weight, stairs, parking) visualization
- Driver context (current effort vs team average)

### Route Visualization
- Interactive map showing all routes
- Color-coded by assigned driver
- Hover for route details

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🧮 How Fairness is Calculated

### Effort Score Formula
```
Effort Score = Base(10) + WeightPenalty + StairsPenalty + ParkingPenalty

Where:
- WeightPenalty = max(0, (weight_kg - 10) × 0.5)
- StairsPenalty = stairs_count × 3
- ParkingPenalty = { easy: 0, moderate: 5, hard: 10 }
```

### Gini Coefficient
The Gini coefficient measures inequality in distribution (0 = perfect equality, 1 = perfect inequality):
```
G = Σ|xi - xj| / (2n²μ)
```

## 🤖 AI Dispatcher Logic

The simulated AI dispatcher considers:

1. **Current Workload Balance** - Prioritizes drivers below team average
2. **Weekly Hard Route History** - Prevents the same drivers from consistently getting difficult routes
3. **Route-Driver Match** - Considers location and timing constraints
4. **Fairness Impact** - Predicts how assignment affects overall Gini coefficient

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet / React-Leaflet
- **UI Components**: Radix UI primitives

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── drivers/          # Driver workload page
│   ├── routes/           # Route visualization
│   ├── dispatch/         # AI Dispatch simulator
│   └── explanations/     # Explainable dispatch
├── components/
│   ├── DriverTable.tsx
│   ├── FairnessChart.tsx
│   ├── FairnessHistoryChart.tsx
│   ├── ExplanationPanel.tsx
│   ├── RouteMap.tsx
│   └── ...
└── lib/
    ├── fairness.ts       # Fairness algorithms
    ├── mockData.ts       # Simulated data & AI logic
    └── supabaseClient.ts # Type definitions
```

## 🎨 Key Design Principles

1. **Transparency over Black Box** - Every decision is explainable
2. **Fairness over Efficiency** - Optimize for equitable distribution, not just speed
3. **Human-like Reasoning** - Explanations sound like a thoughtful dispatcher, not an algorithm
4. **Progressive Disclosure** - Show summary first, details on demand

## 📈 Future Enhancements

- [ ] Real-time GPS integration
- [ ] Driver preference learning
- [ ] Historical pattern analysis
- [ ] Multi-day route optimization
- [ ] Driver feedback loop

---

**FairRoute AI** — We don't make all routes equal, we make the workload fair. ⚖️
