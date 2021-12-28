var documenterSearchIndex = {"docs":
[{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"EditURL = \"https://github.com/JuliaDynamics/AgentsExampleZoo.jl/blob/master/docs/examples/hk.jl\"","category":"page"},{"location":"examples/hk/#Hegselmann-Krause-opinion-dynamics","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"","category":"section"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"This example showcases","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"How to do synchronous updating of Agent properties (also know as Synchronous update schedule). In a Synchronous update schedule changes made to an agent are not seen by other agents until the next step, see also Wilensky 2015, p.286).\nHow to terminate the system evolution on demand according to a boolean function.\nHow to terminate the system evolution according to what happened on the previous step.","category":"page"},{"location":"examples/hk/#Model-overview","page":"Hegselmann-Krause opinion dynamics","title":"Model overview","text":"","category":"section"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"This is an implementation of a simple version of the Hegselmann and Krause (2002) model. It is a model of opinion formation with the question: which parameters' values lead to consensus, polarization or fragmentation? It models interacting groups of agents (as opposed to interacting pairs, typical in the literature) in which it is assumed that if an agent disagrees too much with the opinion of a source of influence, the source can no longer influence the agent's opinion. There is then a \"bound of confidence\". The model shows that the systemic configuration is heavily dependent on this parameter's value.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"The model has the following components:","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"A set of n Agents with opinions xᵢ in the range [0,1] as attribute\nA parameter ϵ called \"bound\" in (0, 0.3]\nThe update rule: at each step every agent adopts the mean of the opinions which are within the confidence bound ( |xᵢ - xⱼ| ≤ ϵ).","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"It is also available from the Models module as Models.hk.","category":"page"},{"location":"examples/hk/#Core-structures","page":"Hegselmann-Krause opinion dynamics","title":"Core structures","text":"","category":"section"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"We start by defining the Agent type and initializing the model. The Agent type has two fields so that we can implement the synchronous update.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"using Agents\nusing Statistics: mean\n\nmutable struct HKAgent <: AbstractAgent\n    id::Int\n    old_opinion::Float64\n    new_opinion::Float64\n    previous_opinion::Float64\nend","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"There is a reason the agent has three fields that are \"the same\". The old_opinion is used for the synchronous agent update, since we require access to a property's value at the start of the step and the end of the step. The previous_opinion is the opinion of the agent in the previous step, as the model termination requires access to a property's value at the end of the previous step, and the end of the current step.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"We could, alternatively, make the three opinions a single field with vector value.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"function hk_model(; numagents = 100, ϵ = 0.2)\n    model = ABM(HKAgent, scheduler = Schedulers.fastest, properties = Dict(:ϵ => ϵ))\n    for i in 1:numagents\n        o = rand(model.rng)\n        add_agent!(model, o, o, -1)\n    end\n    return model\nend\n\nmodel = hk_model()","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"Add some helper functions for the update rule. As there is a filter in the rule we implement it outside the agent_step! method. Notice that the filter is applied to the :old_opinion field.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"function boundfilter(agent, model)\n    filter(\n        j -> abs(agent.old_opinion - j) < model.ϵ,\n        [a.old_opinion for a in allagents(model)],\n    )\nend\nnothing # hide","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"Now we implement the agent_step!","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"function agent_step!(agent, model)\n    agent.previous_opinion = agent.old_opinion\n    agent.new_opinion = mean(boundfilter(agent, model))\nend\nnothing # hide","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"and model_step!","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"function model_step!(model)\n    for a in allagents(model)\n        a.old_opinion = a.new_opinion\n    end\nend\nnothing # hide","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"From this implementation we see that to implement synchronous scheduling we define an Agent type with old and new fields for attributes that are changed via the synchronous update. In agent_step! we use the old field then, after updating all the agents new fields, we use the model_step! to update the model for the next iteration.","category":"page"},{"location":"examples/hk/#Running-the-model","page":"Hegselmann-Krause opinion dynamics","title":"Running the model","text":"","category":"section"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"The parameter of interest is now :new_opinion, so we assign it to variable adata and pass it to the run! method to be collected in a DataFrame.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"In addition, we want to run the model only until all agents have converged to an opinion. From the documentation of step! one can see that instead of specifying the amount of steps we can specify a function instead.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"function terminate(model, s)\n    if any(\n        !isapprox(a.previous_opinion, a.new_opinion; rtol = 1e-12)\n        for a in allagents(model)\n    )\n        return false\n    else\n        return true\n    end\nend\n\nAgents.step!(model, agent_step!, model_step!, terminate)\nmodel[1]","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"Alright, let's wrap everything in a function and do some data collection using run!.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"function model_run(; kwargs...)\n    model = hk_model(; kwargs...)\n    agent_data, _ = run!(model, agent_step!, model_step!, terminate; adata = [:new_opinion])\n    return agent_data\nend\n\ndata = model_run(numagents = 100)\ndata[(end-19):end, :]","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"Notice that here we didn't speciy when to collect data, so this is done at every step. Instead, we could collect data only at the final step, by re-using the same function for the when argument:","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"model = hk_model()\nagent_data, _ = run!(\n    model,\n    agent_step!,\n    model_step!,\n    terminate;\n    adata = [:new_opinion],\n    when = terminate,\n)\nagent_data","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"Finally we run three scenarios, collect the data and plot it.","category":"page"},{"location":"examples/hk/","page":"Hegselmann-Krause opinion dynamics","title":"Hegselmann-Krause opinion dynamics","text":"using DataFrames, CairoMakie\nCairoMakie.activate!() # hide\nusing Random # hide\nRandom.seed!(42) # hide\n\nconst cmap = cgrad(:lightrainbow)\nplotsim(ax, data) =\n    for grp in groupby(data, :id)\n        lines!(ax, grp.step, grp.new_opinion, color = cmap[grp.id[1]/100])\n    end\n\neps = [0.05, 0.15, 0.3]\nfigure = Figure(resolution = (600, 600))\nfor (i, e) in enumerate(eps)\n    ax = figure[i, 1] = Axis(figure; title = \"epsilon = $e\")\n    e_data = model_run(ϵ = e)\n    plotsim(ax, e_data)\nend\nfigure","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"(Image: Agents.jl)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"note: This is an examples-only repository!\nPlease notice that this repository holds only examples of various models implemented in Agents.jl. To actually learn how to use Agents.jl please visit the online documentation first!","category":"page"},{"location":"#Overview-of-Examples","page":"Introduction","title":"Overview of Examples","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Our ever growing list of examples are designed to showcase what is possible with Agents.jl. Here, we outline a number of topics that new and advanced users alike can quickly reference to find exactly what they're looking for.","category":"page"},{"location":"#Discrete-spaces","page":"Introduction","title":"Discrete spaces","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Making a discrete grid is perhaps the easiest way to conceptualise space in a model. That is why the main example of Agents.jl documentation is the Schelling model on a discrete space. Sugarscape is one of our more complex examples, but gives you a good overview of what is possible on a grid. If you're looking for something simpler, then the Forest fire would be a good start, which is also an example of a cellular automaton. Daisyworld is a famous ABM example which has both agent and model dynamics, similarly with Sugarscape.","category":"page"},{"location":"#Continuous-spaces","page":"Introduction","title":"Continuous spaces","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"In this space, agents generally move with a given velocity and interact in a far smoother manner than grid based models.  The Flock model is perhaps the most famous example of bottom-up emergent phenomena and is hosted in the main Agents.jl documentation. Something quite topical at present is our Continuous space social distancing example. Finally, an excellent and complex example of what can be done in a continuous space: Bacterial Growth.","category":"page"},{"location":"#Higher-dimensional-spaces","page":"Introduction","title":"Higher dimensional spaces","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Battle Royale is an advanced example which leverages a 3-dimensional grid space, but only uses 2 of those dimensions for space. The third represents an agent category. Here, we can leverage Agents.jl's sophisticated neighbor searches to find closely related agents not just in space, but also in property.","category":"page"},{"location":"#Agent-Path-finding","page":"Introduction","title":"Agent Path-finding","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Besides the main (and most complex) example we have in the docs with Rabbit, Fox, Hawk, here are two more models showcasing the possibilities of pathfinding: Maze Solver and Mountain Runners.","category":"page"},{"location":"#Synchronous-agent-updates","page":"Introduction","title":"Synchronous agent updates","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Most of the time, using the agent_step! loop then the model_step! is sufficient to evolve a model. What if there's a more complicated set of dynamics you need to employ? Take a look at the Hegselmann-Krause opinion dynamics: it shows us how to make a second agent loop within model_step! to synchronise changes across all agents after agent_step! dynamics have completed.","category":"page"},{"location":"#Agent-sampling","page":"Introduction","title":"Agent sampling","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"The Wright-Fisher model of evolution shows us how we can sample a population of agents based on certain model properties. This is quite helpful in genetic and biology studies where agents are cell analogues.","category":"page"},{"location":"#Cellular-Automata","page":"Introduction","title":"Cellular Automata","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"A subset of ABMs, these models have individual agents with a set of behaviors, interacting with neighboring cells and the world around them, but never moving. Two famous examples of this model type are Conway's game of life and Daisyworld.","category":"page"},{"location":"#Mixed-Models","page":"Introduction","title":"Mixed Models","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"In the real world, groups of people interact differently with people they know vs people they don't know. In ABM worlds, that's no different. Predator-prey dynamics (or more colloquially: Wolf-Sheep) implements interactions between a pack of Wolves, a heard of Sheep and meadows of Grass. Daisyworld is an example of how a model property (in this case temperature) can be elevated to an agent type.","category":"page"},{"location":"#Advanced-visualization","page":"Introduction","title":"Advanced visualization","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"The Sugarscape example shows how to animate, in parallel, one plot that shows the ABM evolution, and another plot that shows any quantity a user is interested in.","category":"page"}]
}
