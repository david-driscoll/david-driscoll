---
title: Getting started with Source Generators (and testing!)
description: |
    Source Generators are a create new feature of the latest .NET SDK that allow you write code
    that... writes more code.
date: 2020-10-25
tags:
  - source generation
  - c#
  - getting started
  - roslyn
  - metaprogramming
---

# What are Source Generators?

Source Generators were [introduced at the end of April 2020](https://devblogs.microsoft.com/dotnet/introducing-c-source-generators/) and they open the door for some constrained [Meta Programming](https://en.wikipedia.org/wiki/Metaprogramming) features native to C#.  Source Generators run just like [Roslyn Analyzers](https://docs.microsoft.com/en-us/visualstudio/code-quality/roslyn-analyzers-overview).

You might think we already have support for Metaprogramming or Aspect Oriented Programming (AOP) using tools like [Fody](https://github.com/Fody/Fody) and [PoshSharp](https://www.postsharp.net/).  You would be correct!  These tools are amazing and in fact they allow you to do _more_ than Source Generators.  Existing solutions transform the [IL](https://en.wikipedia.org/wiki/Common_Intermediate_Language) or byte code of your DLL after it has been compiled.  Source Generators on the other hand allow you introduce code _during compile time_ with all the power of Roslyn.

This brings us to the biggest limitation and that is Source Generators only allow you to introduce new code.  You are unable to modify or remove existing code.  This may seem silly and you could be right, the Roslyn team is taking baby steps to ensure they don't make a large mistake that causes more headache and pain for everyone in a future version.

So if there are limitations, what are source generators good for then? There are many reasons why you would want to create a source generator or use a source.

Today .NET developers like to cheat, if I don't know something at compile time...

  > We can use reflection for that!
  >
  >  <cite>-- Every .NET Developer ever</cite>

Features like serialization, reflection emit and plenty of other features make use of reflection.  Compared to compile code reflection is slow, but more importantly reflection is dynamic.  Going forward reflection will be a limiting factor as .NET moves towards [Assembly Linking and Trimming](https://devblogs.microsoft.com/dotnet/app-trimming-in-net-5/).

With Source Generators you can...
* create a strongly typed serializer
* generate dependency injection configuration
* generate `IPropertyNotifyChanged` for a given class

# Creating a Source Generator

Creating a source generator is similar to a Roslyn Analyzer, with some interesting differences.

# Unit Testing a Source Generator

It's one think to be generating code, it's another thing to ensure that you are generating the _correct_ code or more importantly that you changes to the generator haven't potentially broken code with previous behaviors.  As a consumer of a library if you think it's problematic to change a method name, you're going to love it when the method just no longer exists for no apparent reason.

